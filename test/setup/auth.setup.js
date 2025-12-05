// test/setup/auth.setup.js

const pactum = require('pactum'); // Importe o objeto principal
const { spec } = pactum;

pactum.settings.setFlowsServer({ enabled: false });

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
            // 💡 CORREÇÃO: Usando expectJson para validar e expectJson para message
            // Isso resolve o erro de tipo (AssertionError)
            .expectJson('authorization', /Bearer .+/) 
            .expectJson('message', 'Login realizado com sucesso')
            .stores('authorization', 'accessToken'); // Salva o token JWT
    });
});