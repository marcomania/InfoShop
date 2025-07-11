import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "@inertiajs/react";
import {
    Button,
    Box,
    AppBar,
    Toolbar,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { usePurchase } from "@/Context/PurchaseContext";

export default function PurchaseAppBar({setOpenPayment, selectedVendor, disable=true}) {
    const { cartState, cartTotal, } = usePurchase();

    return (
            <AppBar
                position="fixed"
                variant="contained"
                sx={{ top: "auto", bottom: 0 }}
            >
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} />
                    <Link underline="hover" color="inherit" href="/purchases">
                        <Button
                            variant="contained"
                            color="warning"
                            size="large"
                            startIcon={<ArrowBackIosNewIcon />}
                            sx={{ mr: "1rem" }}
                        >
                            BACK
                        </Button>
                    </Link>

                    <Button
                        variant="contained"
                        type="submit"
                        color="success"
                        size="large"
                        endIcon={<PaymentsIcon />}
                        onClick={() => setOpenPayment(true)}
                        disabled={cartState.length === 0 || !selectedVendor || disable}
                    >
                        PAYMENTS
                    </Button>
                </Toolbar>
            </AppBar>
    );
}
