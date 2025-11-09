// ---teste- trocar pelo bd ---
const usuarios = {
    "aluno1": { senha: "123", nivel: "aluno" },
    "prof1": { senha: "123", nivel: "professor" },
};


const formLogin = document.getElementById('form-login');
const inputUsuario = document.getElementById('usuario');
const inputSenha = document.getElementById('senha');
const msgErro = document.getElementById('mensagem-erro');
const areaLogin = document.getElementById('area-login');


const infoUsuario = document.getElementById('info-usuario');
const nomeUsuarioLogado = document.getElementById('nome-usuario-logado');
const botaoSair = document.getElementById('botao-sair');
const botaoVerPerfil = document.getElementById('botao-ver-perfil');


const conteudoAluno = document.getElementById('conteudo-aluno');
const conteudoProfessor = document.getElementById('conteudo-professor');

const conteudoPerfil = document.getElementById('conteudo-perfil');
const perfilNome = document.getElementById('perfil-nome');
const perfilDescricao = document.getElementById('perfil-descricao');
const avatarIniciais = document.getElementById('avatar-iniciais');
const botaoSalvarPerfil = document.getElementById('botao-salvar-perfil');
const botaoVoltar = document.getElementById('botao-voltar');

let nivelUsuarioLogado = ''; 

/**
 * @param {Event} evento
 */
function tentarLogin(evento) {
    evento.preventDefault(); 

    const usuarioDigitado = inputUsuario.value.trim(); 
    const senhaDigitada = inputSenha.value;

    msgErro.style.display = 'none'; 

    if (usuarios[usuarioDigitado]) {
        const usuarioEncontrado = usuarios[usuarioDigitado];
      
        if (usuarioEncontrado.senha === senhaDigitada) {
       
            nivelUsuarioLogado = usuarioEncontrado.nivel;
            mostrarConteudo(nivelUsuarioLogado, usuarioDigitado);
        } else {
            mostrarErroLogin();
        }
    } else {
        mostrarErroLogin();
    }
}

/**
 * @param {string} nivel 
 * @param {string} nomeUsuario 
 */
function mostrarConteudo(nivel, nomeUsuario) {
    areaLogin.style.display = 'none'; 
    infoUsuario.style.display = 'block'; 
    nomeUsuarioLogado.textContent = nomeUsuario; 

    perfilNome.value = nomeUsuario;
    avatarIniciais.textContent = nomeUsuario.substring(0, 2); // Pega as 2 primeiras letras para o avatar

  
    if (nivel === 'aluno') {
        conteudoAluno.style.display = 'block';
        conteudoProfessor.style.display = 'none';
  
        botaoVerPerfil.style.display = 'inline-block';
    } else if (nivel === 'professor') {
        conteudoAluno.style.display = 'none';
        conteudoProfessor.style.display = 'block';
     
        botaoVerPerfil.style.display = 'inline-block';
    }
}


 
function fazerLogout() {
    nivelUsuarioLogado = ''; 
    
   
    infoUsuario.style.display = 'none'; 
    conteudoAluno.style.display = 'none';
    conteudoProfessor.style.display = 'none';
    conteudoPerfil.style.display = 'none';

    areaLogin.style.display = 'block';
    inputUsuario.value = '';
    inputSenha.value = '';
    msgErro.style.display = 'none';
    perfilDescricao.value = ''; 
}


function mostrarErroLogin() {
    msgErro.style.display = 'block';
    inputSenha.value = ''; 
    inputSenha.focus(); 
}




function mostrarTelaPerfil() {

    conteudoAluno.style.display = 'none';
    conteudoProfessor.style.display = 'none';

    conteudoPerfil.style.display = 'block';
}


function voltarParaConteudo() {
    conteudoPerfil.style.display = 'none';

    if (nivelUsuarioLogado === 'aluno') {
        conteudoAluno.style.display = 'block';
    } else if (nivelUsuarioLogado === 'professor') {
        conteudoProfessor.style.display = 'block';
    }
}


function salvarPerfil() {
  
    alert('Perfil salvo com sucesso! (Simulação)');
    console.log('Nova descrição salva:', perfilDescricao.value);
    

    voltarParaConteudo();
}



formLogin.addEventListener('submit', tentarLogin);
botaoSair.addEventListener('click', fazerLogout);


botaoVerPerfil.addEventListener('click', mostrarTelaPerfil);
botaoVoltar.addEventListener('click', voltarParaConteudo);
botaoSalvarPerfil.addEventListener('click', salvarPerfil);