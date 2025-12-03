// test/setup/auth.setup.js

const { s } = require('pactum');

// Definir um usuário único para evitar conflito de e-mail no banco de dados
const uniqueId = Date.now();
const userEmail = `ci_user_${uniqueId}@teste.com`;
const userPassword = 'senhaSegura123';

describe('SETUP: Criação e Login de Usuário de Teste', () => {
    // 1. Cadastra o novo usuário (POST /usuarios)
    it('Deve cadastrar um novo usuário para os testes', async () => {
        await s.post('http://localhost:3000/usuarios')
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
        await s.post('http://localhost:3000/login')
            .withJson({
                email: userEmail,
                password: userPassword
            })
            .expectStatus(200)
            .expectJsonMatch({
                authorization: /Bearer .+/
            })
            .stores('authorization', 'accessToken'); // Salva o token JWT para uso em todos os testes autenticados
    });
});

// Exemplo de Limpeza (Teardown) - Remova a conta após os testes
// Você pode adicionar um after all aqui ou em um arquivo de hook global se preferir.
/*
describe('TEARDOWN: Limpeza do Usuário', () => {
    it('Deve deletar o usuário criado no setup', async () => {
        await s.delete('http://localhost:3000/usuarios/$S{userId}')
            .withHeaders('Authorization', `$S{accessToken}`)
            .expectStatus(200); 
    });
});
*/