const { reporter, flow, handler, mock } = require('pactum');
const pf = require('pactum-flow-plugin'); 
const { like, eachLike, expression } = require('pactum-matchers'); 

// ----------------------------------------------------
// 1. Configuração Global (Setup do Mock e do Reporter)
// ----------------------------------------------------

function addFlowReporter() {
    // Configuração do Pactum Flow Server
    pf.config.url = 'http://localhost:8180';
    pf.config.projectId = 'lojaebac-front';
    pf.config.projectName = 'Loja EBAC Front';
    pf.config.version = '1.0.3';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter); 
}

// Executado antes de todos os testes
before(async () => {
    // 1. Configura e adiciona o reporter do Pactum Flow 
    // Se o servidor 8180 não estiver online, comente esta linha para evitar falhas de conexão
    addFlowReporter(); 

    await mock.start(4000);
});

after(async () => {

    await mock.stop();
    
    // await reporter.end(); 
});

// ----------------------------------------------------
// 2. Definição das Interações (Contratos)
// ----------------------------------------------------

// Contrato 1: Login Response
handler.addInteractionHandler('Login Response', () => {
    return {
        provider: 'lojaebac-api',
        flow: 'Login',
        request: {
            method: 'POST',
            path: '/public/authUser',
            body: {
                "email": "admin@admin.com",
                "password": "admin123"
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "login successfully",
                "data": {
                    "_id": "65766e71ab7a6bdbcec70d0d",
                    "token": like("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.FAKE.TOKEN") 
                }
            }
        }
    }
});

// Contrato 2: Add Product Success
handler.addInteractionHandler('Add Product Success', () => {
    // Dados Mockados de Resposta
    const mockProductName = 'Produto Contrato Mock';
    const mockProductPrice = 99.99;
    const mockCategoryId = '65f6c825a0b7774e1d1e44f0';

    return {
        provider: 'lojaebac-api',
        flow: 'Add Product', 
        request: {
            method: 'POST',
            path: '/api/addProduct', 
            headers: {
                'Authorization': like('Bearer JWT_TOKEN_AQUI') 
            },
            body: {
                "name": like('Qualquer Nome String'), 
                "price": like(75.90),             // Exige tipo Number (Float)
                "quantity": like(5.00),           // Exige tipo Number (Float)
                "description": like('Qualquer Descrição String'), 
                
                //eachLike garante Array de Strings, baseado no seu teste de API
                "categories": eachLike('ID-CATEGORIA-STRING', { min: 1 }) 
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "product added",
                "data": {
                    "_id": like("65f6c825a0b7774e1d1e44f1"), 
                    "name": mockProductName, 
                    "price": mockProductPrice,
                    "quantity": like(Number), 
                    "description": like(String), 
                    "categories": [mockCategoryId], 
                    "__v": like(0)
                }
            }
        }
    }
});

// ----------------------------------------------------
// 3. Casos de Teste (Consumer Tests)
// ----------------------------------------------------

describe('TESTES DE CONTRATO (CONSUMER)', () => {

    it('FRONT - deve autenticar o usuario corretamente (Login Contract)', async () => {
        await flow("Login")
            .useInteraction('Login Response')
            .post('http://localhost:4000/public/authUser')
            .withJson({
                "email": "admin@admin.com",
                "password": "admin123"
            })
            .expectStatus(200)
            .expectJson('success', true);
    });

    // TESTE DE CONTRATO: Adição de Produto
    it('FRONT - deve adicionar um novo produto corretamente (Add Product Contract)', async () => {

        // Dados de requisição (Consumidor)
        const fakeToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.FAKE.TOKEN";
        const newProductName = "Produto Front-end Teste"; 
        const newProductPrice = 150.50;
        const newProductQuantity = 5.00;
        const newProductDescription = "Mocked description";
        const categoryId = '65f6c825a0b7774e1d1e44f0';

        await flow("Add Product")
            .useInteraction('Add Product Success') 
            .post('http://localhost:4000/api/addProduct') 
            .withHeaders("Authorization", fakeToken) 
            .withJson({
                "name": newProductName,
                "price": newProductPrice,
                "quantity": newProductQuantity, 
                "description": newProductDescription,
                "categories": [categoryId] // Array de strings, correspondendo ao eachLike
            })
            .expectStatus(200)
            .expectJson('success', true)
            // Asserção contra os valores MOCKADOS no Contrato
            .expectJson('data.name', 'Produto Contrato Mock') 
            .expectJson('data.price', 99.99); 
    });
});