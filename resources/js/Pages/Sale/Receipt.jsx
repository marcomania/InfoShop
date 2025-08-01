import React, { useRef, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    Button,
    Box,
    Typography,
    Paper,
    Card,
    CardMedia,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { styled } from "@mui/material/styles";
import numeral from "numeral";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";
import Barcode from "./Barcode";

export default function Receipt({ sale, salesItems, settings, user_name, credit_sale = false }) {
    const user = usePage().props.auth.user;
    const currency_symbol = usePage().props.settings.currency_symbol;

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    const [receiptNo, setReceiptNo] = useState(' ' + sale.sale_prefix + "/" + sale.invoice_number);

    const handleWhatsAppShare = () => {
        const currentUrl = window.location.href; // Get the current URL
        const message = `Your purchase at ${settings.shop_name} receipt: \n${currentUrl}`; // Customize your message
        const encodedMessage = encodeURIComponent(message); // URL encode the message
        let whatsappNumber = sale.whatsapp; // Get the contact number from sale

        // Check if the WhatsApp number is empty
        if (!whatsappNumber) {
            // Prompt the user for their WhatsApp number
            whatsappNumber = prompt("Please enter the WhatsApp number (including country code):", '94');

            // If the user cancels the prompt, exit the function
            if (!whatsappNumber) {
                alert("WhatsApp number is required to share the message.");
                return;
            }
        }

        // Construct the WhatsApp URL
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getReceiptWhatsappAscii())}`;
        window.open(whatsappUrl, '_blank'); // Open in a new tab
    };

    const ReceiptContainer = styled(Paper)(({ theme }) => ({
        width: "500px",
        padding: theme.spacing(3),
        textAlign: "center",
        "@media print": {
            boxShadow: "none", // Remove shadow for print
            // padding:0
        },
    }));

    const ReceiptPrintContainer = styled(Paper)(({ theme }) => ({
        width: "100%",
        fontFamily: settings.sale_print_font,
        textAlign: "center",
        boxShadow: "none",
        "@media print": {
            boxShadow: "none", // Remove shadow for print
        },
    }));

    const styles = {
        receiptTopText: {
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },
        receiptSummaryText: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "bold",
            borderBottom: "none",
            fontFamily: settings.sale_print_font,
        },
        receiptSummaryTyp: {
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },
        itemsHeader: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
            py: 1,
            pt: 0,
        },
        itemsHeaderTyp: {
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },

        itemsCells: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "500",
            py: 1,
            verticalAlign: "middle",
            fontFamily: settings.sale_print_font,
        },
        itemsCellsTyp: {
            fontSize: "13px",
            fontWeight: "500",
            fontFamily: settings.sale_print_font,
        },

        printArea: {
            paddingRight: parseFloat(settings.sale_print_padding_right),
            paddingLeft: parseFloat(settings.sale_print_padding_left),
        },
    };

    if (!sale || Object.keys(sale).length === 0) {
        return (
            <Box className="flex justify-center mt-10 p-0">
                <Typography variant="h6" color="error">
                    No pending sales available.
                </Typography>
            </Box>
        );
    }

    const itemDiscount = salesItems.reduce((acc, item) => acc + item.discount * item.quantity, 0);

    function getReceiptWhatsappAscii() {
        const lineWidth = 42;
        const formatLine = (qty, name, total) => {
            const qtyNum = Number(qty);
            const totalNum = Number(total);

            return (
                qtyNum.toFixed(3).padStart(6) + " | " +
                name.padEnd(20).slice(0, 20) + " | " +
                totalNum.toFixed(2).padStart(7)
            );
        };

        const lines =salesItems.map(item => {
            const itemTotal = numeral(parseFloat(item.quantity) * (item.unit_price - item.discount)).format("0,0.00")
            return formatLine(item.quantity, item.name, itemTotal);
        });

        const total = Number(sale.total_amount);
        const recibido = parseFloat(sale.amount_received || 0);
        const deuda = Math.max(total - recibido, 0);
        
        const rightAlign = (label, value) => {
            const text = `${label}: ${value.toFixed(2)}`;
            return text.padStart(lineWidth);
        };

        const centerText = (text) => {
            const totalPad = lineWidth - text.length;
            const padLeft = Math.floor(totalPad / 2);
            const padRight = totalPad - padLeft;
            return " ".repeat(padLeft) + text + " ".repeat(padRight);
        };

        const asciiTable = [
            "```",
            centerText(`*${settings.shop_name}*`),
            "------------------------------------------",
            `RUC: 10082646341`,
            `Order: ${receiptNo}`,
            `Date: ${dayjs(sale.created_at).format("DD-MMM-YYYY, h:mm A")}`,
            "------------------------------------------",
            " Cant  | Producto             |  Total",
            "------------------------------------------",
            ...lines,
            "------------------------------------------",
            rightAlign("Total", total),
            rightAlign("Recibido", recibido),
            deuda > 0 ? rightAlign("Deuda", deuda) : null,
            "```",
        ].join("\n");

        return asciiTable;
    }

    return (
        <>
            <Head title="Sale Receipt" />
            <Box className="flex justify-center mt-10 p-0">
                <ReceiptContainer square={false} className="receipt-container">
                    <Box className="flex justify-between mb-3 print:hidden">

                        {user && (
                            <Button
                                onClick={() => window.history.back()}
                                variant="outlined"
                                startIcon={<ArrowBackIosIcon />}
                            >
                                Back
                            </Button>
                        )}
                        {user && (
                            <Button
                                onClick={handleWhatsAppShare}
                                variant="contained"
                                color="success"
                                endIcon={<WhatsAppIcon />}
                            >
                                Whatsapp
                            </Button>
                        )}

                        {user && (
                            <Button
                                onClick={reactToPrintFn}
                                variant="contained"
                                endIcon={<PrintIcon />}
                            >
                                Print
                            </Button>
                        )}
                    </Box>
                    <div
                        id="print-area"
                        ref={contentRef}
                        className="p-0"
                        style={styles.printArea}
                    >
                        <ReceiptPrintContainer square={false}>
                            <Box className="flex justify-center items-center mt-0 flex-col">
                                <Card sx={{ width: 160, boxShadow: 0 }}>
                                    <CardMedia
                                        component="img"
                                        image={settings.shop_logo}
                                    />
                                    RUC: 10082646341
                                </Card>
                                {settings.show_receipt_shop_name == 1 && (
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: "20px",
                                            fontFamily:
                                                settings.sale_print_font,
                                            fontWeight: "bold",
                                        }}
                                        color="initial"
                                        className="receipt-shop-name"
                                    >
                                        {settings.shop_name}
                                    </Typography>
                                )}
                                <Box sx={{ fontSize: '12px' }}>
                                    {sale.address}
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: "20px",
                                        fontFamily: settings.sale_print_font,
                                    }}
                                    color="initial"
                                    className="receipt-address"
                                >
                                    <b>Order: {receiptNo}</b>
                                </Typography>
                            </Box>
                            <Divider
                                sx={{
                                    borderBottom: "1px dashed",
                                    borderColor: "grey.700",
                                    my: "1rem",
                                }}
                                className="receipt-divider-after-address"
                            />
                            <Box className="flex items-start flex-col justify-start receipt-meta">


                                {!credit_sale && (
                                    <>
                                        <Typography
                                            sx={styles.receiptTopText}
                                            color="initial"
                                            textAlign={"start"}
                                        >
                                            Date:
                                            {dayjs(sale.created_at).format(
                                                "DD-MMM-YYYY, h:mm A"
                                            ) + " "}
                                            By: {user_name}
                                        </Typography>
                                    </>
                                )}
                                {credit_sale && (
                                    <>
                                        <Typography
                                            sx={styles.receiptTopText}
                                            color="initial"
                                            textAlign={"start"}
                                        >
                                            Print date:
                                            {dayjs(sale.created_at).format(
                                                "DD-MMM-YYYY, h:mm A"
                                            ) + " "}
                                        </Typography>
                                    </>
                                )}



                                <Typography
                                    sx={styles.receiptTopText}
                                    color="initial"
                                >
                                    Cliente: {sale.name}
                                </Typography>
                            </Box>
                            <Divider
                                sx={{
                                    borderBottom: "1px dashed",
                                    borderColor: "grey.700",
                                    my: "1rem",
                                }}
                                className="receipt-divider-after-details"
                            />

                            <TableContainer>
                                <Table
                                    sx={{ width: "100%", padding: "0" }}
                                >
                                    <TableHead>
                                        <TableRow className="receipt-items-header">
                                            <TableCell sx={styles.itemsHeader}>
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Item
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Qty.
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Price
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Disc.
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Total
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {salesItems.map((item, index) => (
                                            <React.Fragment key={`item-${index}`}>
                                                {/* First Row: Product Name */}
                                                <TableRow
                                                    key={`name-row-${index}`}
                                                    className="receipt-product-row"
                                                >
                                                    <TableCell
                                                        colSpan={5}
                                                        sx={{
                                                            ...styles.itemsCells,
                                                            borderBottom:
                                                                "none",
                                                            paddingBottom: 0,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            <strong>
                                                                {" "}
                                                                {index + 1}.
                                                                {item.name}{" "}
                                                                {item.account_number
                                                                    ? "| " +
                                                                    item.account_number
                                                                    : ""}
                                                            </strong>
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow
                                                    key={`details-row-${index}`}
                                                    className="receipt-details-row"
                                                >
                                                    <TableCell
                                                        sx={styles.itemsCells}
                                                        align="right"
                                                        colSpan={2}
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            <strong>{item.quantity}x</strong>
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={styles.itemsCells}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            {numeral(
                                                                item.unit_price
                                                            ).format("0,0.00")}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={styles.itemsCells}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            {numeral(
                                                                item.discount
                                                            ).format("0,0.00")}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={styles.itemsCells}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            <strong>
                                                                {numeral(
                                                                    parseFloat(
                                                                        item.quantity
                                                                    ) *
                                                                    (item.unit_price -
                                                                        item.discount)
                                                                ).format(
                                                                    "0,0.00"
                                                                )}
                                                            </strong>
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))}

                                        {/* Spacer Row */}
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                sx={{
                                                    padding: "7px 0",
                                                    borderBottom: "none",
                                                }}
                                            />
                                        </TableRow>

                                        {itemDiscount !== 0 && (
                                            <TableRow
                                                sx={{ border: "none", }}
                                                className="receipt-summary-row"
                                            >
                                                <TableCell
                                                    sx={{...styles.receiptSummaryText, paddingBottom: 1 }}
                                                    colSpan={5}
                                                    align="center"
                                                >
                                                    <Typography
                                                        sx={{...styles.receiptSummaryText, border:'solid 2px', width: '100%', padding: 1 }}
                                                        color="initial"
                                                    >
                                                        Item Discount: {numeral(itemDiscount).format("0,0.00")}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {/* Row for Total, Discount, Subtotal, Amount Received, Change */}
                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                                color="initial"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Total:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                                color="initial"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    {currency_symbol}
                                                    {numeral(
                                                        parseFloat(
                                                            sale.total_amount
                                                        ) +
                                                        parseFloat(
                                                            sale.discount
                                                        )
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        {parseFloat(sale.discount) !== 0 && (
                                            <TableRow
                                                sx={{ border: "none" }}
                                                className="receipt-summary-row"
                                            >
                                                <TableCell
                                                    sx={styles.receiptSummaryText}
                                                    colSpan={4}
                                                    align="right"
                                                >
                                                    <Typography
                                                        sx={
                                                            styles.receiptSummaryTyp
                                                        }
                                                        color="initial"
                                                    >
                                                        Discount:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    sx={styles.receiptSummaryText}
                                                    align="right"
                                                >
                                                    <Typography
                                                        sx={
                                                            styles.receiptSummaryTyp
                                                        }
                                                        color="initial"
                                                    >
                                                        {currency_symbol}
                                                        {numeral(
                                                            sale.discount
                                                        ).format("0,0.00")}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={{ ...styles.receiptSummaryText, paddingBottom: 2 }}
                                                colSpan={4}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Subtotal:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={{ ...styles.receiptSummaryText, paddingBottom: 2 }}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    {currency_symbol}
                                                    {numeral(
                                                        sale.total_amount
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Paid:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    {currency_symbol}
                                                    {numeral(
                                                        sale.amount_received
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Balance:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    {currency_symbol}
                                                    {numeral(
                                                        parseFloat(
                                                            sale.amount_received
                                                        ) -
                                                        parseFloat(
                                                            sale.total_amount
                                                        )
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        {/* Conditional row for Old Balance */}
                                        {credit_sale && parseFloat(sale.amount_received) - parseFloat(sale.total_amount) !== parseFloat(sale.balance) && (
                                            <>
                                                <TableRow
                                                    sx={{ border: "none" }}
                                                    className="receipt-summary-row"
                                                >
                                                    <TableCell
                                                        sx={styles.receiptSummaryText}
                                                        colSpan={4}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={styles.receiptSummaryTyp}
                                                            color="initial"
                                                        >
                                                            Old Balance:
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={styles.receiptSummaryText}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={styles.receiptSummaryTyp}
                                                            color="initial"
                                                        >
                                                            {currency_symbol}
                                                            {numeral(
                                                                parseFloat(sale.balance) -
                                                                (parseFloat(sale.amount_received) -
                                                                    parseFloat(sale.total_amount))
                                                            ).format("0,0.00")}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow
                                                    sx={{ border: "none" }}
                                                    className="receipt-summary-row"
                                                >
                                                    <TableCell
                                                        sx={styles.receiptSummaryText}
                                                        colSpan={4}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={styles.receiptSummaryTyp}
                                                            color="initial"
                                                        >
                                                            Total Balance:
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={styles.receiptSummaryText}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={styles.receiptSummaryTyp}
                                                            color="initial"
                                                        >
                                                            {currency_symbol} {numeral(sale.balance).format("0,0.00")}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Divider
                                sx={{
                                    borderBottom: "1px dashed",
                                    borderColor: "grey.700",
                                    my: "1rem",
                                }}
                                className="receipt-divider-before-footer"
                            />
                            <div className="receipt-barcode flex justify-center">
                                <Barcode value={sale.invoice_number} />
                            </div>

                            <Divider
                                sx={{
                                    borderBottom: "1px dashed",
                                    borderColor: "grey.700",
                                    my: "1rem",
                                }}
                                className="receipt-divider-before-footer"
                            />

                            <div
                                className="receipt-footer"
                                style={styles.receiptSummaryText}
                                dangerouslySetInnerHTML={{
                                    __html: settings.sale_receipt_note,
                                }}
                            />
                            <Typography sx={{ fontSize: '12px', fontWeight: "bold" }} >
                                Hor. de Atención: LUN-SAB 9:00am-9:00pm
                            </Typography>
                            
                            <div 
                                className="receipt-second-note"
                                style={styles.receiptSummaryText}
                                dangerouslySetInnerHTML={{
                                    __html: settings.sale_receipt_second_note,
                                }}
                            />
                        </ReceiptPrintContainer>
                    </div>
                </ReceiptContainer>
            </Box>
        </>
    );
}
