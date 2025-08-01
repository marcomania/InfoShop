import React, { useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography, Box } from "@mui/material";
import { usePage } from "@inertiajs/react";

import { useSales as useCart } from "@/Context/SalesContext";
import { SharedContext } from "@/Context/SharedContext";
import productplaceholder from "@/Pages/Product/product-placeholder.webp";

export default function ProductItem({ product }) {
    const return_sale = usePage().props.return_sale;
    const currency_symbol = usePage().props.settings.currency_symbol;

    const { name, price, image_url, quantity } = product;
    const { addToCart, cartState } = useCart();
    const { setCartItemModalOpen, setSelectedCartItem } = useContext(SharedContext);

    const handleAddToCart = () => {
        if (return_sale) {
            product.quantity = -1
        }
        else product.quantity = 1;

        if (product.discount_percentage && Number(product.discount_percentage) !== 0) {
            const discount = (product.price * product.discount_percentage) / 100;
            product.discount = discount;
        }
        console.log(product);
        addToCart(product, 0);

        if (product.product_type === "reload") {
            const lastAddedIndex = cartState.length > 0 ? cartState.length : 0;
            product.cart_index = lastAddedIndex;
        }

        setSelectedCartItem(product);
        setCartItemModalOpen(true);
    }


    return (
        <Card
            onClick={handleAddToCart}
            sx={{ height: '100%', position: 'relative' }}
        >
            <CardMedia
                sx={{ height: 120 }}
                image={image_url ? image_url : productplaceholder}
                title={name}
            />
            <CardContent sx={{ paddingBottom: "10px!important", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Typography
                    variant="p"
                    component="div"
                    className="text-center"
                    sx={{ lineHeight: "1.2rem" }}
                >
                    {name}
                    {/* - ({quantity}) */}
                </Typography>
            </CardContent>
            {price > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                    }}
                >
                    {currency_symbol} {price}
                </Box>
            )}
        </Card>
    );
}
