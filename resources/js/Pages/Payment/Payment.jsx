import * as React from "react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import {
    Button,
    Box,
    MenuItem,
    TextField,
    Chip,
    IconButton
} from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import dayjs from "dayjs";
import Select2 from "react-select";
import numeral from "numeral";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Swal from "sweetalert2";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomPagination from "@/Components/CustomPagination";
import ViewDetailsDialog from "@/Components/ViewDetailsDialog";

const columns = (handleRowClick) => [
    {
        field: "id", headerName: "ID", width: 80,
        renderCell: (params) => {
            return params.value.toString().padStart(4, "0");
        },
    },
    {
        field: "transaction_date",
        headerName: "Date",
        width: 100,
        renderCell: (params) => {
            // Format the date to 'YYYY-MM-DD'
            return dayjs(params.value).format("YYYY-MM-DD");
        },
    },
    {
        field: "transaction_type", headerName: "Type", width: 100,
        renderCell: (params) => {
            return params.value.toUpperCase();
        },
    },
    { field: "contact_name", headerName: "Customer Name", width: 200 },
    {
        field: "reference_id",
        headerName: "Reference",
        width: 120,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
            if (params.value === null) {
                return "N/A"; // Or any other suitable message for null values
            }
            return (
                <Button variant="text" onClick={() => handleRowClick("view_details",params.value)}>
                    {"#" + params.value.toString().padStart(4, "0")}
                </Button>
            );
        },
    },
    { field: "payment_method", headerName: "Payment Method", width: 150 },
    { field: "note", headerName: "Note", width: 100 },
    {
        field: "amount", headerName: "Total Amount", width: 120, align: 'right', headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 100,
        renderCell: (params) => {
            // Format the date to 'YYYY-MM-DD'
            return (
                <>
                    <IconButton disabled={params.row.payment_method === 'Credit' || params.row.parent_id !== null} color="error" onClick={() => handleRowClick('delete', params.row.id)}>
                        <HighlightOffIcon />
                    </IconButton>
                </>
            )
        },
    },
];

export default function Payment({ payments, transactionType, contacts, selected_contact }) {
    const [dataPayments, setDataPayments] = useState(payments);
    const [paymentSelect, setPaymentSelect] = useState(transactionType);
    const [paymentMethod, setPaymentMethod] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedContact, setSelectedContact] = useState({ name: '', id: selected_contact });
    const [totalAmount, setTotalAmount] = useState(0)
    const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleRowClick = (type, id) => {
        if (type == 'delete') {
            Swal.fire({
                title: "Do you want to remove the payment?",
                showDenyButton: true,
                confirmButtonText: "YES",
                denyButtonText: `NO`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post(`/delete-payment/${transactionType}`, { transaction_id: id })
                        .then((response) => {
                            const updatedData = dataPayments.data.filter((item) => item.id !== id);
                            setDataPayments({ ...dataPayments, data: updatedData });
                            Swal.fire({
                                title: "Success!",
                                text: response.data.message,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                            });
                        })
                        .catch((error) => {
                            Swal.fire({ title: error.response.data.error, showConfirmButton: true, icon: "error", })
                            console.error("Deletion failed with errors:", error);
                        });
                }
            });
        }else if (type == 'view_details') {
            setSelectedTransaction(id);
            setViewDetailsModalOpen(true);
        }
    };

    const refreshPayments = (url) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["payments"], // Only reload specified properties
            onSuccess: (response) => {
                setDataPayments(response.props.payments);
            },
        };
        router.get(url, {
            contact_id: selectedContact?.id,
            payment_method: paymentMethod,
            start_date: startDate,
            end_date: endDate,
        },
            options);
    };

    const handleSelectPayments = (type) => {
        setPaymentSelect(type);
        if (type == "sales") router.get("/payments/sales?page=1");
        if (type == "purchases") router.get("/payments/purchases?page=1");
    };

    const handleContactChange = (selectedOption) => {
        setSelectedContact(selectedOption);
    };

    useEffect(() => {
        const total = Object.values(dataPayments.data).reduce((accumulator, current) => {
            return accumulator + parseFloat(current.amount);
        }, 0);
        setTotalAmount(total);
    }, [dataPayments]);

    return (
        <AuthenticatedLayout>
            <Head title="Payments" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
                justifyContent={"end"}
                size={12}
            >

                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        value={paymentSelect}
                        label="Select payments"
                        onChange={(e) => handleSelectPayments(e.target.value)}
                        required
                        name="payment_type"
                        fullWidth
                        select
                    >
                        <MenuItem value={"sales"}>Sales Payment</MenuItem>
                        <MenuItem value={"purchases"}>
                            Purchase Payment
                        </MenuItem>
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }}>
                    <Select2
                        className="w-full"
                        placeholder="Select a contact..."
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                height: "55px",
                            }),
                        }}
                        options={contacts} // Options to display in the dropdown
                        onChange={handleContactChange} // Triggered when an option is selected
                        isClearable // Allow the user to clear the selected option
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                    ></Select2>
                </Grid>

                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        value={paymentMethod}
                        label="Select Payment Method"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        name="payment_method"
                        select
                        fullWidth
                    >
                        <MenuItem value={"All"}>All</MenuItem>
                        <MenuItem value={"Cash"}>Cash</MenuItem>
                        <MenuItem value={"Card"}>Card</MenuItem>
                        <MenuItem value={"Credit"}>Credit</MenuItem>
                        <MenuItem value={"Cheque"}>Cheque</MenuItem>
                        <MenuItem value={"Account Balance"}>Account Balance</MenuItem>
                        <MenuItem value={"Account"}>Account</MenuItem>
                    </TextField>
                </Grid>

                <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                        label="Start Date"
                        name="start_date"
                        placeholder="Start Date"
                        fullWidth
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                        label="End Date"
                        name="end_date"
                        placeholder="End Date"
                        fullWidth
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 1 }}>
                    <Button
                        variant="contained"
                        onClick={() => refreshPayments(window.location.pathname)}
                        sx={{ height: "100%" }}
                        fullWidth
                    >
                        <FindReplaceIcon />
                    </Button>
                </Grid>


            </Grid>

            <Box
                className="py-6 w-full"
                sx={{ display: "grid", gridTemplateColumns: "1fr", height: '73vh' }}
            >
                <DataGrid
                    rows={dataPayments?.data}
                    columns={columns(handleRowClick)}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    hideFooter
                />
            </Box>
            <Grid size={12} container justifyContent={'end'}>
                <Chip size="large" label={'Total:' + numeral(totalAmount).format('0,0.00')} color="primary" />
                <CustomPagination
                    dataLinks={dataPayments?.links}
                    refreshTable={refreshPayments}
                    dataLastPage={dataPayments?.last_page}
                ></CustomPagination>
            </Grid>

            {viewDetailsModalOpen && (
                <ViewDetailsDialog
                    open={viewDetailsModalOpen}
                    setOpen={setViewDetailsModalOpen}
                    type={"sale"}
                    selectedTransaction={selectedTransaction}
                />
            )}
        </AuthenticatedLayout>
    );
}
