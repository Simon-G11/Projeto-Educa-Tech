USE escola_divertida;

-- 1. Crie um aluno de teste
INSERT INTO alunos (nome, idade, turma, descricao) 
VALUES ('Pingo', 8, '2A', 'Adoro jogos de matemática!');

-- 2. Crie os jogos
INSERT INTO jogos (nome_jogo, descricao) 
VALUES ('Quiz de Matemática', 'Teste seus conhecimentos'),
       ('Caça-Palavras', 'Encontre as palavras escondidas');

-- 3. Crie as pontuações
INSERT INTO pontuacoes (id_aluno, id_jogo, pontos) 
VALUES (1, 1, 150),
       (1, 2, 300),
       (1, 1, 250);