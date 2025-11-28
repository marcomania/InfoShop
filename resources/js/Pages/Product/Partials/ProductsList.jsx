import React from 'react';
import { Button, IconButton } from '@mui/material';
import { Barcode, History, Star } from 'lucide-react';
import { Link, router } from '@inertiajs/react';

const ProductsList = ({ products, handleProductEdit }) => {
    return (
        <ul className='faded-bottom no-scrollbar grid gap-2 overflow-auto pt-1 pb-1 w-full'>
            {products.map((product) => (
                <li className="p-3 w-full shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="uppercase tracking-wide text-sm text-blue-900 font-semibold">
                            <Link
                                href={"/products/" + product.id + "/edit"}
                            >
                                {product.name}
                            </Link>
                        </div>
                        <div className='flex ml-2'>
                            <IconButton>
                                <Star size={20} />
                            </IconButton>
                            <IconButton onClick={()=>router.visit(`/quantity/${product.stock_id}/log`)}>
                                <History size={20} />
                            </IconButton>
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                        <div onClick={() => handleProductEdit(product, 'batch')}>
                            <div className="text-gray-500 text-sm">Sale Price</div>
                            <div className="text-gray-700 text-sm font-bold">Rs. {product.price}</div>
                        </div>
                        <div onClick={() => handleProductEdit(product, 'batch')}>
                            <div className="text-gray-500 text-sm">Cost</div>
                            <div className="text-gray-700 text-sm font-bold">Rs {product.cost}</div>
                        </div>
                        <div onClick={() => handleProductEdit(product, 'qty')}>
                            <div className="text-gray-500 text-sm">In Stock</div>
                            <div className="text-gray-700 text-sm font-bold">{product.quantity}</div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProductsList;