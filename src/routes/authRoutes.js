// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checarSeAdmin } = require('../middleware/authMiddleware');

// --- Rotas Públicas ---
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);

// --- Rotas de Admin ---
router.get('/admin', checarSeAdmin, authController.getAdminPage);
router.get('/cadastro', checarSeAdmin, authController.getRegisterPage);
router.post('/cadastro', checarSeAdmin, authController.postRegister);

// 👇 ROTA NOVA ADICIONADA AQUI 👇
// Rota para MOSTRAR a lista de todos os alunos
router.get('/admin/alunos', checarSeAdmin, authController.getAlunosPage);

module.exports = router;