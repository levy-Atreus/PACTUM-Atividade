const { spec, request } = require('pactum');

// Configuração Global do Arquivo
request.setBaseUrl('http://lojaebac.ebaconline.art.br');
request.setDefaultHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

let token;  
let productId; 
let categoryId; 

describe('Testes de API - Loja EBAC (Produtos e Categorias)', () => {

    beforeEach(async () => {
        // 1. LOGIN: Busca o token e garante o formato Bearer
        const loginRes = await spec()
            .post('/public/authUser')
            .withJson({
                "email": "admin@admin.com",
                "password": "admin123"
            })
            .expectStatus(200);
        
        // A API pode retornar o token em 'body.token' ou 'body.data.token'
        const rawToken = loginRes.body.token || (loginRes.body.data && loginRes.body.data.token);
        token = `Bearer ${rawToken}`;

        // 2. SETUP CATEGORIA: Necessária para vincular ao produto
        const categoryRes = await spec()
            .post('/api/addCategory')
            .withHeaders("Authorization", token)
            .withJson({
                "name": `Categoria Requisito ${Date.now()}`
            })
            .expectStatus(200);
        
        categoryId = categoryRes.body._id || (categoryRes.body.data && categoryRes.body.data._id);

        // 3. SETUP PRODUTO: Criado para ser editado ou deletado nos testes abaixo
        const productRes = await spec()
            .post('/api/addProduct')
            .withHeaders("Authorization", token)
            .withJson({
                "name": `Produto Temporario ${Date.now()}`,
                "price": 50.00, 
                "quantity": 10, 
                "description": "Teste Automatizado", 
                "categories": [categoryId]
            })
            .expectStatus(200);
        
        productId = productRes.body._id || (productRes.body.data && productRes.body.data._id);
    });

    it('API - deve adicionar um novo produto', async () => {
        const newProductName = "Livro de Testes"; 
        const newProductPrice = 75.90;

        await spec()
            .post('/api/addProduct') 
            .withHeaders("Authorization", token) 
            .withJson({
                "name": newProductName, 
                "price": newProductPrice, 
                "quantity": 5, 
                "description": "Novo produto", 
                "categories": [categoryId]
            })
            .expectStatus(200) 
            .expectJsonLike({
                "success": true,
                "data": { "name": newProductName }
            });
    });

    it('API - deve editar o produto corretamente', async () => {
        const nomeAtualizado = `Editado ${Date.now()}`;
        
        await spec()
            .put(`/api/editProduct/${productId}`) 
            .withHeaders("Authorization", token)
            .withJson({ "name": nomeAtualizado })
            .expectStatus(200) 
            .expectJson('success', true);
    });

    it('API - deve deletar o produto corretamente', async () => {
        await spec()
            .delete(`/api/deleteProduct/${productId}`) 
            .withHeaders("Authorization", token)
            .expectStatus(200) 
            .expectJson('success', true);
    });
});