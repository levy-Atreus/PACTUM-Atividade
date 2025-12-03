// Exemplo de código de setup.js usando Pactum
const { s } = require('pactum');

// Variáveis para armazenar o token e o ID
let accessToken;
let userId;
let testUser = { 
  nome: `Teste CI ${Date.now()}`,
  email: `ci_user_${Date.now()}@teste.com`,
  password: 'senhaSegura123',
  administrador: 'true'
};

describe('SETUP: Criar e Logar Usuário para Testes', () => {
  it('Deve cadastrar um novo usuário', async () => {
    await s.post('http://localhost:3000/usuarios')
      .withJson(testUser)
      .expectStatus(201)
      .expectJsonMatch({ 
        message: 'Cadastro realizado com sucesso',
        _id: /.+/
      })
      .stores('_id', 'userId'); // Salva o ID do usuário
  });

  it('Deve logar com o novo usuário e salvar o token', async () => {
    await s.post('http://localhost:3000/login')
      .withJson({
        email: testUser.email,
        password: testUser.password
      })
      .expectStatus(200)
      .expectJsonMatch({
        message: 'Login realizado com sucesso',
        authorization: /Bearer .+/
      })
      .stores('authorization', 'accessToken'); // Salva o token JWT
  });
});

// A variável 'accessToken' agora pode ser usada em todos os seus testes!
// Ex: .withHeaders('Authorization', `$S{accessToken}`)