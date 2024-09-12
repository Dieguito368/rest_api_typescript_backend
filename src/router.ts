import { Router } from 'express';
import { body, param } from 'express-validator';
import { getProducts, getProductById, createProdut, updateProduct, updateAvailability, deleteProduct } from './handlers/product';
import { handleInputErrors } from './middleware';

const router = Router();
/** 
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      desciption: The Product name
 *                      example: Monitor curvo de 32 pulgadas
 *                  price:
 *                      type: number
 *                      description: The product price
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true 
*/

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags: 
 *              - Products
 *          description: Return  a list of products
 *          responses: 
 *              200: 
 *                  description: Successfull response 
 *                  content: 
 *                      application/json: 
 *                          schema:
 *                              type: array
 *                              items: 
 *                                  $ref: '#/components/schemas/Product'
*/
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Return a product based an its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer  
 *          responses:
 *              200:
 *                  description: Successfull response
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Not found
 *              400:
 *                  description: Bad Request - Invalid ID
*/
router.get(
    '/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getProductById
);

/**
 * @swagger
 * /api/products:
 *      post:
 *          summary: Creates a new product
 *          tags: 
 *              - Products
 *          description: Return a new record in the database
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: 'Monitor curvo 49 pulgadas'
 *                              price: 
 *                                  type: number
 *                                  example: 5000
 *          responses:
 *              201:
 *                  description: Product created successfully
 *                  content: 
 *                      aplicattion/json:
 *                          schema: 
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad Request - Invalid input data
*/
router.post(
    '/', 
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    handleInputErrors,
    createProdut
);

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Updates a product with user input
 *          tags:
 *              - Products
 *          description: Returns the updated product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: 'Monitor curvo 49 pulgadas'
 *                              price: 
 *                                  type: number
 *                                  example: 5000
 *                              availability:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Product updated successfully 
 *                  content: 
 *                      aplicattion/json:
 *                          schema: 
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Product Not Found
 *              400:
 *                  description: Bad Request - Invalid input data
*/
router.put(
    '/:id', 
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('availability').isBoolean().withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *          summary: Update Product availability
 *          tags:
 *              - Products
 *          description: Returns the updated availability
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Availability the Product updated successfully 
 *                  content: 
 *                      aplicattion/json:
 *                          schema: 
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Product Not Found
 *              400:
 *                  description: Invalid ID
*/
router.patch(
    '/:id',
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *      delete:
 *          summary: Deletes a product by a given ID
 *          tags: 
 *              - Products
 *          description: Returns a confirmation message
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to delete
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Product deleted successfully 
 *                  content: 
 *                      aplicattion/json:
 *                          schema:
 *                              type: string 
 *                              value: 'Producto eliminado correctamente'
 *              404:
 *                  description: Product Not Found
 *              400:
 *                  description: Invalid ID
*/
router.delete(
    '/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct
);

export default router;