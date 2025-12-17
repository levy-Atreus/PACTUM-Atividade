const { spec } = require('pactum'); 

// 💡 CORREÇÃO: Definindo a URL da EBAC em vez do localhost
const BASE_URL = 'http://lojaebac.ebaconline.art.br';

const uniqueId = Date.now();
const userEmail = `admin@admin.com`; // Usando o admin padrão da EBAC
const userPassword = 'admin123';

describe('SETUP: Validação de Credenciais', () => {
    
    // 1. Apenas valida se o login está funcionando antes de iniciar os testes pesados
    it('Deve validar se o servidor EBAC está respondendo ao login', async () => {
        await spec()
            .post(`${BASE_URL}/public/authUser`)
            .withJson({
                email: userEmail,
                password: userPassword
            })
            .expectStatus(200)
            .stores('token', 'accessToken'); // Salva o token globalmente se precisar
    });
});