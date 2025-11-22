// Middleware para checar se o usuário é um ALUNO logado
const checarSeLogado = (req, res, next) => {
    // Checa se está logado E se é um aluno
    if (req.session.alunoId && req.session.role === 'aluno') {
        return next(); // Se estiver logado, continue
    }
    res.redirect('/login'); // Se não, mande para a página de login
};

// Middleware para checar se o usuário é um PROFESSOR ADMIN
const checarSeAdmin = (req, res, next) => {
    // Checa se está logado, se é professor E se é admin
    if (req.session.alunoId && req.session.role === 'professor' && req.session.isAdmin) {
        return next(); // Se for Admin, continue
    }
    // Se não for admin, nega o acesso
    res.status(403).send('Acesso negado. Você não é um administrador.');
};

// Middleware para checar se o usuário é um PROFESSOR GERAL (NOVO)
const checarSeProfessor = (req, res, next) => {
    // Checa se está logado E se é professor
    if (req.session.alunoId && req.session.role === 'professor') {
        return next(); // Se for Professor, continue
    }
    // Se não for professor, nega o acesso
    res.status(403).send('Acesso negado. Acesso exclusivo para professores.');
};

module.exports = {
    checarSeLogado,
    checarSeAdmin,
    checarSeProfessor
};