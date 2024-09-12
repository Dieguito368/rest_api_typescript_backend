import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.8.0',
            description: 'API Docs for Products'
        }
    },
    apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiOptions : SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url('https://cdn-icons-png.freepik.com/512/10195/10195335.png');
            height: 100px;
        }

        .swagger-ui .topbar {
            background-color: #2B3B45;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / TypeScript / Node.js'
}

export default swaggerSpec;