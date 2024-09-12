import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ]
    });

    res.status(200).json({ data: products });
}

export const getProductById  = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if(!product) {
        return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.status(200).json({ data: product });
}

export const createProdut = async (req: Request, res: Response) => {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json({ data: savedProduct });
}

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if(!product) {
        return res.status(404).json({ error: 'Producto no encontrado' } );
    }

    // Actualizar
    await product.update(req.body);
    await product.save();

    res.status(200).json({ data: product })
}

export const updateAvailability = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if(!product) {
        return res.status(404).json({ error: 'Producto no encontrado' })
    }

    product.availability = !product.dataValues.availability;
    await product.save();

    res.status(200).json({ data: product })
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if(!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await product.destroy();

    res.status(200).json({ data: 'Producto eliminado correctamente' })
}