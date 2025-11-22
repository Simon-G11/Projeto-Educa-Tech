const db = require('../config/database');

module.exports = {
  // 1. LISTAR JOGOS ATIVOS (ALUNO) - Rota: /jogos
  listarJogosAtivos: async (req, res) => { 
    try {
      // Busca apenas jogos onde ativo é TRUE
      const [jogos] = await db.query('SELECT id_jogo, nome_jogo, descricao FROM jogos WHERE ativo = TRUE ORDER BY nome_jogo'); 
      // Renderiza a nova view para o aluno
      res.render('jogosAluno', { jogos: jogos }); 
    } catch (err) {
      console.error('Erro ao listar jogos ativos:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  },

  //LISTAR TODOS (ADMIN)
  listarTodos: async (req, res) => { 
    try {
      const [jogos] = await db.query('SELECT * FROM jogos'); 
      res.render('library', { jogos: jogos }); 
    } catch (err) {
      console.error('Erro ao listar todos os jogos:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  },

  //FORMULÁRIO NOVO JOGO
  formNovo: (req, res) => {
    res.render('novojogo');
  },

  //CRIAR NOVO JOGO
  criar: async (req, res) => { 
    const { nome_jogo, descricao } = req.body;
    try {
      await db.query( 
        'INSERT INTO jogos (nome_jogo, descricao) VALUES (?, ?)',
        [nome_jogo, descricao]
      );
      res.redirect('/jogos/admin');
    } catch (err) {
      console.error('Erro ao criar novo jogo:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  },

  //FORMULÁRIO EDITAR JOGO
  formEditar: async (req, res) => { 
    try {
      const [result] = await db.query('SELECT * FROM jogos WHERE id_jogo = ?', [req.params.id]); // 👈 Usar await
      if (result.length === 0) {
        return res.status(404).send('Jogo não encontrado.');
      }
      res.render('editarjogo', { jogo: result[0] });
    } catch (err) {
      console.error('Erro ao buscar jogo para edição:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  },

  //EDITAR JOGO
  editar: async (req, res) => { 
    const { nome_jogo, descricao, ativo } = req.body;
    const ativoStatus = ativo === "on" || ativo === true ? true : false; 
    
    try {
      await db.query( 
        'UPDATE jogos SET nome_jogo=?, descricao=?, ativo=? WHERE id_jogo=?',
        [nome_jogo, descricao, ativoStatus, req.params.id]
      );
      res.redirect('/jogos/admin');
    } catch (err) {
      console.error('Erro ao editar jogo:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  },

  //EXCLUIR JOGO
  excluir: async (req, res) => { 
    try {
      await db.query('DELETE FROM jogos WHERE id_jogo = ?', [req.params.id]); // 👈 Usar await
      res.redirect('/jogos/admin');
    } catch (err) {
      console.error('Erro ao excluir jogo:', err);
      res.status(500).send('Erro interno do servidor.');
    }
  }
};