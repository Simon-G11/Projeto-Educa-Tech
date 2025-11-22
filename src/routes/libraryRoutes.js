const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { checarSeProfessor } = require('../middleware/authMiddleware');
// Página para os alunos (somente jogos ativos)
router.get('/', libraryController.listarJogosAtivos);

// Área do professor 
//(Rotas protegidas - URL base será /jogos) 

// Rota para checar permissão de professor
router.get('/admin', checarSeProfessor, libraryController.listarTodos); 
// Rota para criar um novo jogo
router.get('/admin/novo', checarSeProfessor, libraryController.formNovo); 
router.post('/admin/novo', checarSeProfessor, libraryController.criar); 
// Rota para editar um jogo
router.get('/admin/editar/:id', checarSeProfessor, libraryController.formEditar); 
router.post('/admin/editar/:id', checarSeProfessor, libraryController.editar); 
// Rota para excluir um jogo
router.get('/admin/excluir/:id', checarSeProfessor, libraryController.excluir); 


module.exports = router;
