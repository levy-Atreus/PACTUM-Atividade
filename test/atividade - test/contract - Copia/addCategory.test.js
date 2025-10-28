const { reporter, flow, handler, mock } = require('pactum');
const pf = require('pactum-flow-plugin'); 
const { like } = require('pactum-matchers'); 

// ----------------------------------------------------
// 1. Configuração Global (Setup do Mock e do Reporter)
// ----------------------------------------------------

function addFlowReporter() {
    // URL do Pactum Flow Server
    pf.config.url = 'http://localhost:8180';
    pf.config.projectId = 'lojaebac-front';
    pf.config.projectName = 'Loja EBAC Front';
    pf.config.version = '1.0.3';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);// Adiciona o reporter ao PactumJS
}

before(async () => {
    
    await mock.start(4000);
});

after(async () => {
    
    await mock.stop();
    await reporter.end(); 
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

// Contrato 2: Add Category Success
handler.addInteractionHandler('Add Category Success', () => {
    const mockCategoryName = 'Categoria Contrato Mock';

    return {
        provider: 'lojaebac-api',
        flow: 'Add Category',
        request: {
            method: 'POST',
            path: '/api/addCategory',
            headers: {
                'Authorization': like('Bearer JWT_TOKEN_AQUI') 
            },
            body: {
                "name": like("mockCategoryName")
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "category added",
                "data": {
                    "_id": like("65766e71ab7a6bdbcec70d0d"), 
                    "name": mockCategoryName,
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

    it('FRONT - deve adicionar uma nova categoria corretamente (Add Category Contract)', async () => {

        const fakeToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.FAKE.TOKEN";
        const categoryName = "Nova Categoria Teste"; // Valor enviado pelo Consumidor

        await flow("Add Category")
            .useInteraction('Add Category Success')
            .post('http://localhost:4000/api/addCategory')
            .withHeaders("Authorization", fakeToken)
            .withJson({
                "name": categoryName
            })
            .expectStatus(200)
            .expectJson('success', true)
            // Asserção contra o valor MOCKADO no Contrato, não contra o valor enviado
            .expectJson('data.name', 'Categoria Contrato Mock'); 
    });
});