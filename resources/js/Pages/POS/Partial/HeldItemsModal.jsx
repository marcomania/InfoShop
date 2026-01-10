import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { useSales as useCart } from "@/Context/SalesContext";
import { useDate } from '@/hooks/useDate';

import {
    IconButton,
    Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function HeldItemsModal({
    modalOpen,
    setModalOpen,
}) {
    const { setHeldCartToCart, removeHeldItem, heldCarts } = useCart();
    const heldCartKeys = Object.keys(heldCarts || {});
    const { formatDate } = useDate();

    const handleClose = () => {
        setModalOpen(false);
    };

    const handleLoadHeldCart = (key) => {
        setHeldCartToCart(key)       // Remove it from localStorage
        handleClose()
    };

    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth={"xs"}
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    {"HOLD ITEMS"}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <Grid container spacing={2} display={'flex'} flexDirection={'column'}>
                        {heldCartKeys.map((key) => (
                            <ListItemButton
                                key={key}
                                onClick={() => handleLoadHeldCart(key)} // Set the cart when clicked
                            >
                                <ListItemText primary={formatDate(key)} /> {/* Display the cart key */}
                            </ListItemButton>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
