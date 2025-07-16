import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Box, Button, Typography, Divider } from "@mui/material";

export default function Receipt({ sale, salesItems, settings, user_name, credit_sale = false }) {
  const printRef = useRef(null);

  const reactToPrintContent = () => {
    return printRef.current;
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

  const handlePrint = useReactToPrint({
    documentTitle: `Ticket-${sale?.invoice_number || "venta"}`,
  });

  const currency = "S/.";

  const total = parseFloat(sale?.total_amount || 0);
  const amountReceived = parseFloat(sale?.amount_received || 0);



  return (
    <Box className="flex flex-col items-center">
      {/* Botón de impresión (oculto al imprimir) */}
      <Box className="">
        <Button onClick={() => handlePrint(reactToPrintContent)} variant="contained">
          Imprimir Ticket
        </Button>
      </Box>

      {/* Área imprimible */}
      <Box
        ref={printRef}
        sx={{
          width: "280px",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "12px",
          lineHeight: 1.4,
          color: "black",
        }}
        className="receipt-container"
      >
        <Typography align="center" fontWeight="bold">
          LAVANDERÍA FORTALEZA
        </Typography>
        <Typography align="center">
          Cl 20 de Agosto Mz L8 Fortaleza
          <br /> Vitarte
          <br /> Tel: (+51) 993 242 321
          <br /> RUC: 10456789231
        </Typography>
        <Divider className="receipt-divider-after-address" />

        <Typography>
          Cliente: {sale.name}
          <br /> Fecha: {new Date(sale.created_at).toLocaleString()}
          <br /> Pedido: #{sale.invoice_number}
        </Typography>

        <Typography align="center">------------------------------</Typography>

        {/* Lista de ítems */}
        {salesItems.map((item, i) => (
          <Box key={i}>
            <Typography>{`${i + 1}. ${item.name}`}</Typography>
            <Box className="flex justify-between">
              <span>{`${item.quantity} x ${currency}${parseFloat(item.unit_price).toFixed(2)}`}</span>
              <span>{`${currency}${(
                parseFloat(item.quantity) * parseFloat(item.unit_price)
              ).toFixed(2)}`}</span>
            </Box>
          </Box>
        ))}

        <Typography align="center">------------------------------</Typography>

        {/* Totales */}
        <Box className="flex justify-between font-bold">
          <span>Subtotal:</span>
          <span>{currency}{total.toFixed(2)}</span>
        </Box>
        <Box className="flex justify-between">
          <span>Pagado:</span>
          <span>{currency}{amountReceived.toFixed(2)}</span>
        </Box>
        <Box className="flex justify-between">
          <span>Vuelto:</span>
          <span>{currency}{(amountReceived - total).toFixed(2)}</span>
        </Box>

        <Typography align="center">------------------------------</Typography>

        <Typography align="center">¡Gracias por su preferencia!</Typography>
      </Box>
    </Box>
  );
};
