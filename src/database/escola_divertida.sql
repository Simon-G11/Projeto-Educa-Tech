CREATE DATABASE escola_divertida;
USE escola_divertida;
CREATE USER 'aluno_web'@'localhost' IDENTIFIED BY 'SenhaAluno@2025';
GRANT ALL PRIVILEGES ON escola_divertida.* TO 'aluno_web'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade INT NOT NULL,
  turma VARCHAR(10) NOT NULL
);

ALTER TABLE alunos
RENAME COLUMN id TO id_aluno;

CREATE TABLE professores (
  id_professor INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);

ALTER TABLE alunos
ADD COLUMN descricao TEXT NULL,
ADD COLUMN avatar VARCHAR(255) NULL;


CREATE TABLE  jogos (
  id_jogo INT AUTO_INCREMENT PRIMARY KEY,
  nome_jogo VARCHAR(100) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE perguntas (
  id_pergunta INT AUTO_INCREMENT PRIMARY KEY,
  id_jogo INT NOT NULL,
  enunciado TEXT NOT NULL,
  alternativa_a VARCHAR(255) NULL,
  alternativa_b VARCHAR(255) NULL,
  alternativa_c VARCHAR(255) NULL,
  alternativa_d VARCHAR(255) NULL,
  resposta_correta CHAR(1) NOT NULL,
  FOREIGN KEY (id_jogo) REFERENCES jogos(id_jogo) ON DELETE CASCADE
);


CREATE TABLE pontuacoes (
  id_pontuacao INT AUTO_INCREMENT PRIMARY KEY,
  id_aluno INT NOT NULL,
  id_jogo INT NOT NULL,
  pontos INT DEFAULT 0,
  data_partida DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE,
  FOREIGN KEY (id_jogo) REFERENCES jogos(id_jogo) ON DELETE CASCADE
);
