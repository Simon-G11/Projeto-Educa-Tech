// 1. IMPORTAÇÕES
// =============================================
require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./src/config/database');
const bcrypt = require('bcrypt');
const session = require('express-session'); // <-- 1. IMPORTANDO O PACOTE DE SESSÃO

// 2. INICIALIZAÇÃO DO APP E CONSTANTES
// =============================================
const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

// 3. CONFIGURAÇÃO (Middlewares e View Engine)
// =============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({ extended: true }));

// ⭐️ 2. CONFIGURANDO A SESSÃO ("crachá")
// Isso cria um "crachá" (cookie) para o usuário se manter logado.
app.use(session({
    secret: 'segredo-muito-secreto-para-os-jogos', // Mude isso para qualquer frase
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Em produção (com HTTPS) mude para 'true'
        maxAge: 1000 * 60 * 60 * 24 // Cookie expira em 1 dia
    }
}));

// Middleware para checar se o usuário está logado
// Vamos usar isso para proteger a página de perfil
const checarSeLogado = (req, res, next) => {
    if (req.session.alunoId) {
        return next(); // Se está logado, continue
    }
    res.redirect('/login'); // Se não, mande para a página de login
};

// 4. ROTAS DA APLICAÇÃO
// =============================================

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// ⭐️ 3. ROTA POST /login (AGORA FUNCIONAL)
app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        // 1. Tenta encontrar o aluno pelo 'usuario'
        const query = 'SELECT * FROM alunos WHERE usuario = ?';
        const [alunos] = await db.query(query, [usuario]);

        // 2. Se não encontrar o usuário (array 'alunos' está vazio)
        if (alunos.length === 0) {
            console.log('Tentativa de login falhou: usuário não encontrado');
            return res.redirect('/login'); // (Idealmente, com uma mensagem de erro)
        }

        const aluno = alunos[0];

        // 3. Compara a senha digitada com a senha hasheada do banco
        const senhaCorreta = await bcrypt.compare(senha, aluno.senha);

        // 4. Se a senha estiver errada
        if (!senhaCorreta) {
            console.log('Tentativa de login falhou: senha incorreta');
            return res.redirect('/login'); // (Idealmente, com uma mensagem de erro)
        }

        // 5. SUCESSO! Senha correta.
        // Damos o "crachá" (sessão) para o usuário, salvando o ID dele
        req.session.alunoId = aluno.id_aluno;
        req.session.nomeAluno = aluno.nome;
        
        console.log(`Usuário ${aluno.nome} (ID: ${aluno.id_aluno}) logado.`);
        
        // 6. Redireciona para o perfil
        res.redirect('/perfil');

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.post('/cadastro', async (req, res) => {
    const { nome, idade, turma, usuario, senha } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        const insertQuery = `
            INSERT INTO alunos 
            (nome, idade, turma, usuario, senha) 
            VALUES (?, ?, ?, ?, ?);
        `;
        await db.query(insertQuery, [nome, idade, turma, usuario, hashedPassword]);
        res.redirect('/login');
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).send('Usuário já existe.');
        }
        res.status(500).send('Erro ao cadastrar.');
    }
});

// ⭐️ 4. ROTA /perfil (AGORA PROTEGIDA E DINÂMICA)
// Usamos nosso middleware 'checarSeLogado'
app.get('/perfil', checarSeLogado, async (req, res) => {
    
    // NÃO é mais fixo! Pegamos o ID do "crachá" (sessão)
    const userId = req.session.alunoId; 

    try {
        const query = `
            SELECT 
                a.nome AS username,
                a.avatar,
                COALESCE(SUM(p.pontos), 0) AS total_pontos,
                COALESCE(COUNT(DISTINCT p.id_jogo), 0) AS total_jogos
            FROM 
                alunos AS a
            LEFT JOIN 
                pontuacoes AS p ON a.id_aluno = p.id_aluno
            WHERE 
                a.id_aluno = ?
            GROUP BY
                a.id_aluno, a.nome, a.avatar;
        `;

        const [rows] = await db.query(query, [userId]);
        
        if (rows.length === 0) {
            // Isso pode acontecer se o aluno for deletado enquanto logado
            req.session.destroy(); // Limpa a sessão inválida
            return res.redirect('/login');
        }

        const dadosDoUsuario = rows[0];
        const level = Math.floor(dadosDoUsuario.total_pontos / 500) + 1;

        const profileData = {
            username: dadosDoUsuario.username,
            avatar: dadosDoUsuario.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${dadosDoUsuario.username}`, 
            points: dadosDoUsuario.total_pontos,
            level: level, 
            games: dadosDoUsuario.total_jogos
        };

        res.render('profile', profileData);

    } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
        res.status(500).send('Erro interno do servidor ao carregar o perfil.');
    }
});

// ⭐️ 5. ROTA /logout (PARA DESTRUIR O "crachá")
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao fazer logout.');
        }
        // Limpa o cookie do navegador
        res.clearCookie('connect.sid'); // O nome padrão do cookie de sessão
        res.redirect('/login');
    });
});

// 5. INICIALIZAÇÃO DO SERVIDOR
// =============================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});