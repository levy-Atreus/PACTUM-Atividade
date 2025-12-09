// test/setup/auth.setup.js

// 💡 CORREÇÃO 1: Importa 'spec' e 'settings' via desestruturação.
//const { spec, settings } = require('pactum'); 
const { spec } = require('pactum'); 

// 💡 CORREÇÃO 2: Desativa o Flows Server (Solução para o TypeError e ECONNREFUSED).
//settings.setFlowsServer({ enabled: false });

// Definir um usuário único para evitar conflito de e-mail no banco de dados
const uniqueId = Date.now();
const userEmail = `ci_user_${uniqueId}@teste.com`;
const userPassword = 'senhaSegura123';

describe('SETUP: Criação e Login de Usuário de Teste', () => {
    // 1. Cadastra o novo usuário (POST /usuarios)
    it('Deve cadastrar um novo usuário para os testes', async () => {
        await spec().post('http://localhost:3000/usuarios')
            .withJson({
                nome: `Teste CI ${uniqueId}`,
                email: userEmail,
                password: userPassword,
                administrador: 'true'
            })
            .expectStatus(201)
            .stores('_id', 'userId'); // Salva o ID para futuras limpezas
    });

    // 2. Faz o login e salva o token (POST /login)
    it('Deve logar com o novo usuário e salvar o token', async () => {
        await spec().post('http://localhost:3000/login')
            .withJson({
                email: userEmail,
                password: userPassword
            })
            .expectStatus(200)
            // 💡 CORREÇÃO 3: Usa expectJson para evitar o AssertionError de tipo.
            .expectJson('authorization', /Bearer .+/) 
            .expectJson('message', 'Login realizado com sucesso')
            .stores('authorization', 'accessToken'); // Salva o token JWT
    });
});