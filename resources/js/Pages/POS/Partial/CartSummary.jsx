import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import { ListItem, TextField, Divider, Typography } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import numeral from "numeral";
import { useSales as useCart } from '@/Context/SalesContext';

export default function CartSummary() {
    const { cartState, cartTotal, totalQuantity } = useCart();

    return (
        <List sx={{ width: "100%", bgcolor: "background.paper",}}>
            <Divider
                sx={{
                    borderBottom: "2px dashed",
                    borderColor: "grey.500",
                    my: "1.5rem",
                }}
            />
            <ListItem
                secondaryAction={
                    <Typography variant="h5" color="initial" sx={{fontSize:{sm:'1rem', xs:'1.2rem'}}}>
                        <strong>{cartState.length} | Qty. {totalQuantity}</strong>
                    </Typography>
                }
            >
                <ListItemText primary="Total Items" />
            </ListItem>
            <ListItem
                secondaryAction={
                    <Typography variant="h5" color="initial" sx={{fontSize:{sm:'1rem', xs:'1.2rem'}}}>
                        {/* Rs.{(cartTotal-discount).toFixed(2)} */}
                        <strong>Rs.{numeral(cartTotal).format('0,00.00')}</strong> 
                    </Typography>
                }
            >
                <ListItemText primary="Total" />
            </ListItem>
        </List>
    );
}
