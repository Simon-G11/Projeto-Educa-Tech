// 1. IMPORTAÇÕES
// =============================================
// Carrega variáveis de ambiente (do .env) ANTES de todo o resto
require('dotenv').config(); 

const express = require('express');
const path = require('path');
// Importa nossa conexão do "pool" do MySQL
const db = require('./src/config/database'); 

// 2. INICIALIZAÇÃO DO APP
// =============================================
// Cria a aplicação Express (aqui corrigimos o erro "app is not defined")
const app = express();
// Define a porta: usa a do .env ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// 3. CONFIGURAÇÃO (Middlewares e View Engine)
// =============================================
// Diz ao Express para usar EJS como "motor" de templates
app.set('view engine', 'ejs');
// Diz ao Express onde fica a pasta "views"
app.set('views', path.join(__dirname, 'src/views'));
// Diz ao Express para servir arquivos estáticos (CSS, JS, imagens) da pasta "public"
app.use(express.static(path.join(__dirname, 'src/public')));

// 4. ROTAS DA APLICAÇÃO
// =============================================

/**
 * Rota Principal (Home)
 * Apenas para dar "oi" e ter um link para o perfil.
 */
app.get('/', (req, res) => {
    res.send('<h1>Página Inicial dos Jogos</h1><a href="/perfil">Ver Perfil</a>');
});

/**
 * Rota da Página de Perfil
 * Busca dados no banco e renderiza o EJS.
 */
app.get('/perfil', async (req, res) => {
    
    // ATENÇÃO: Por enquanto, estamos "fixando" o ID do aluno que queremos ver.
    // No futuro, você pegará isso de uma sessão de login (ex: req.session.userId)
    const userId = 1; 

    try {
        // Query SQL que busca o aluno e JÁ CALCULA seus pontos e jogos
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
                a.id_aluno = ?  -- <-- Usando a coluna correta 'id_aluno'
            GROUP BY
                a.id_aluno, a.nome, a.avatar;
        `;

        // Executa a query no banco de dados
        const [rows] = await db.query(query, [userId]);
        
        // Verifica se o aluno foi encontrado
        if (rows.length === 0) {
            return res.status(404).send('Aluno não encontrado!');
        }

        // Pega o primeiro (e único) resultado
        const dadosDoUsuario = rows[0];

        // Lógica de Negócio: Calcular o nível
        // Ex: A cada 500 pontos, o aluno sobe 1 nível.
        const level = Math.floor(dadosDoUsuario.total_pontos / 500) + 1;

        // Prepara o objeto de dados para enviar ao EJS
        const profileData = {
            username: dadosDoUsuario.username,
            // Se o avatar for nulo no banco, usa um padrão baseado no nome
            avatar: dadosDoUsuario.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${dadosDoUsuario.username}`, 
            points: dadosDoUsuario.total_pontos,
            level: level, 
            games: dadosDoUsuario.total_jogos
        };

        // Renderiza o arquivo "views/profile.ejs" e passa o objeto 'profileData'
        res.render('profile', profileData);

    } catch (error) {
        // Captura qualquer erro do banco de dados ou da lógica
        console.error('Erro ao buscar dados do perfil:', error);
        res.status(500).send('Erro interno do servidor ao carregar o perfil.');
    }
});

// ... (Aqui você pode adicionar futuras rotas: /jogos, /login, etc.) ...


// 5. INICIALIZAÇÃO DO SERVIDOR
// =============================================
// Coloca o servidor para "ouvir" na porta definida
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});