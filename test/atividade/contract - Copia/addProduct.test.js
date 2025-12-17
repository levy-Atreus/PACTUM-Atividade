const { reporter, flow, handler, mock } = require('pactum');
const pf = require('pactum-flow-plugin'); 
const { like, eachLike } = require('pactum-matchers'); 

// ----------------------------------------------------
// 1. Configuração Global (Setup do Mock e do Reporter)
// ----------------------------------------------------

function addFlowReporter() {
    pf.config.url = 'http://localhost:8180';
    pf.config.projectId = 'lojaebac-front';
    pf.config.projectName = 'Loja EBAC Front';
    pf.config.version = '1.0.3';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    
    // ✅ COMENTADO: Evita erro de conexão no GitHub Actions (Porta 8180)
    // reporter.add(pf.reporter); 
}

before(async () => {
    addFlowReporter(); 
    await mock.start(4000);
});

after(async () => {
    await mock.stop();
    // ✅ Finaliza o reporter apenas se ele estiver ativo
    if (reporter.reporters.length > 0) {
        await reporter.end(); 
    }
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
                "price": like(75.90),
                "quantity": like(5.00),
                "description": like('Qualquer Descrição String'), 
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
                    "quantity": like(10), 
                    "description": like("Descrição"), 
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

describe('TESTES DE CONTRATO (CONSUMER) - PRODUTOS', () => {

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

    it('FRONT - deve adicionar um novo produto corretamente (Add Product Contract)', async () => {
        const fakeToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.FAKE.TOKEN";
        const categoryId = '65f6c825a0b7774e1d1e44f0';

        await flow("Add Product")
            .useInteraction('Add Product Success') 
            .post('http://localhost:4000/api/addProduct') 
            .withHeaders("Authorization", fakeToken) 
            .withJson({
                "name": "Produto Front-end Teste",
                "price": 150.50,
                "quantity": 5.0, 
                "description": "Mocked description",
                "categories": [categoryId]
            })
            .expectStatus(200)
            .expectJson('success', true)
            .expectJson('data.name', 'Produto Contrato Mock') 
            .expectJson('data.price', 99.99); 
    });
});