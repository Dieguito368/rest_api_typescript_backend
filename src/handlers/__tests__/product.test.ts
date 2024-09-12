import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
    test('Should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(4);

        expect(response.status).not.toBe(404);
        expect(response.body).not.toHaveProperty('data');
        expect(response.body.errors).not.toHaveLength(1);
    });

    test('Should validate that the price is greather than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor curvo',
            price: 0
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body).not.toHaveProperty('data');
        expect(response.body.errors).not.toHaveLength(2);
    });

    test('Should validate that the price is a number', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor curvo',
            price: 'Hola'
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);

        expect(response.status).not.toBe(404);
        expect(response.body).not.toHaveProperty('data');
        expect(response.body.errors).not.toHaveLength(1);
    });

    test('Should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 50
        })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('GET /api/products', () => {
    test('Should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products');
        
        expect(response.status).not.toBe(404);
    });

    test('Get a JSON response with products', async () => {
        const response = await request(server).get('/api/products');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(1);
        
        expect(response.headers['content-type']).not.toMatch(/text/);
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('GET /api/products/:id', () => {
    test('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response = await request(server).get(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Producto no encontrado');
    });

    test('Should check a valid ID in the URL', async () => {
        const productId = 'invalid-id';
        const response = await request(server).get(`/api/products/${productId}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    test('Get a JSON response for a single product', async () => {
        const productId = 1;
        const response = await request(server).get(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(404);
    });
});

describe('PUT /api/products/:id', () => {
    test('Should check a valid ID in the URL', async () => {
        const productId = 'invalid-id';
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: 'Monitor curvo',
            availability: true,
            price: 1000
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    test('Should display validation error messages when updating a product', async () => {
        const productId = 1;
        const response = await request(server).put(`/api/products/${productId}`).send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(5);


        expect(response.status).not.toBe(200);
        expect(response.body.errors).not.toHaveProperty('data');
        expect(response.body.errors).not.toHaveLength(1);
    });

    test('Should valdidate that the price is greater than 0', async () => {
        const productId = 1;
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: 'Monitor curvo',
            availability: true,
            price: 0
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Precio no válido')


        expect(response.status).not.toBe(200);
        expect(response.body.errors).not.toHaveProperty('data');
        expect(response.body.errors).not.toHaveLength(2);
    });

    test('Should return a 404 response for a non-existent product', async () => {
        const productId = 1000;
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: 'Monitor curvo',
            availability: true,
            price: 3000
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    test('Should update an existing product with valid data', async () => {
        const productId = 1;
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: 'Monitor curvo',
            availability: true,
            price: 3000
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(404);
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('PATCH /api/products/:id', () => {
    test('Should check a valid ID in the URL', async () => {
        const productId = 'invalid-id';
        const response = await request(server).patch(`/api/products/${productId}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    test('Should return a 404 response for a non-existent product', async () => {
        const productId = 1000;
        const response = await request(server).patch(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    test('Should update the product availability', async () => {
        const productId = 1;
        const response = await request(server).patch(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(404);
        expect(response.body).not.toHaveProperty('error');
    });
});

describe('DELETE /api/products:id', () => {
    test('Should check a valid ID in the URL', async () => {
        const productId = 'invalid-id';
        const response = await request(server).delete(`/api/products/${productId}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    test('Should return a 404 response for a non-existent product', async () => {
        const productId = 1000;
        const response = await request(server).delete(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    test('Should delete a product', async () => {
        const productId = 1;
        const response = await request(server).delete(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toBe('Producto eliminado correctamente');

        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    });
});
