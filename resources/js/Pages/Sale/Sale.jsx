import { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Box, TextField, MenuItem, Tooltip, Chip, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Select2 from "react-select";
import numeral from "numeral";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import AddPaymentDialog from "@/components/AddPaymentDialog";
import ViewDetailsDialog from "@/components/ViewDetailsDialog";
import CustomPagination from "@/components/CustomPagination";
import { CircleXIcon, FunnelXIcon, Package, PrinterIcon, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentSummary } from "@/components/PaymentSummary";

const columns = (handleRowClick) => [
    {
        field: "id",
        headerName: "ID",
        width: 60,
        renderCell: (params) => {
            return "#" + params.value.toString().padStart(4, "0");
        },
    },
    {
        field: "invoice_number",
        headerName: "No",
        width: 140,
        renderCell: (params) => (
            <Button
                variant="link"
                className="p-0"
                onClick={() => handleRowClick(params.row, "view_details")}
            >
                {"#" + params.value.toString().padStart(4, "0")}
            </Button>
        ),
    },
    {
        field: "name", headerName: "Cliente", width: 200,
        renderCell: (params) => (
            <span>{params.value}</span>
        ),
    },
    {
        field: "discount", headerName: "Descuento", width: 80, align: 'right', headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    {
        field: "total_amount", headerName: "Importe", width: 80, align: 'right', headerAlign: 'right',
        renderCell: (params) => {
            return numeral(params.value).format('0,0.00');
        },
    },
    {
        field: "amount_received",
        headerName: "Recibido",
        width: 80, align: 'right', headerAlign: 'right',
        renderCell: (params) => (
            <Button
                variant="link"
                className="align-right p-0"
                onClick={() => handleRowClick(params.row, "add_payment")}
            >
                <b>{numeral(params.value).format('0,0.00')}</b>
            </Button>
        ),
    },
    {
        field: "change",
        headerName: "Cambio", 
        width: 80, align: 'right', headerAlign: 'right',
        renderCell: (params) => {
            const change = params.row.amount_received - params.row.total_amount;
            const formatted = numeral(change).format('0,0.00');
            const colorClass = change < 0 ? 'text-red-500' : 'text-green-500';
            return (
                <span className={colorClass}>
                {formatted}
                </span>
            );
        },
    },
    // { field: 'profit_amount', headerName: 'Profit Amount', width: 120 },
    { field: "status", headerName: "Estado", align: 'center', headerAlign: 'center', width: 120,
        renderCell: (params) => {
            const status = params.row.status;
            

            if (status === "completed") {
                return (
                    <Badge variant="secondary" className="text-green-600 bg-green-100 border-green-200">
                        Completed
                    </Badge>
                );
            }

            if (status === "pending") {
                return (
                    <Badge variant="secondary" className="text-orange-400 bg-orange-100 border-orange-200">
                        Pending
                    </Badge>
                );
            }
            return null;
        },
    },
    { field: "payment_status", headerName: "Estado Pago", width: 120,
        renderCell: (params) => {
            const payment_status = params.row.payment_status;
            const total_amount = params.row.total_amount;
            const amount_received = params.row.amount_received;
            
            return (
                <div 
                    className="justify-center h-full cursor-pointer"
                    onClick={() => handleRowClick(params.row, "add_payment")}
                >
                    <PaymentSummary paid={Number(amount_received)} total={Number(total_amount)} status={payment_status} />
                </div>
            );
            
        }, 
    },
    {
        field: "sale_date",
        headerName: "Fecha",
        width: 100
    },
    {
        field: "action",
        headerName: "Acciones",
        width: 150,
        renderCell: (params) => (
            <div className="flex items-center gap-1 h-full">
                {/* Botón Imprimir */}
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => router.visit("/receipt/" + params.row.id)}
                    className="group rounded-full border border-transparent bg-gradient-to-br from-blue-50 to-blue-100/80 hover:from-blue-100 hover:to-blue-200/90 hover:border-blue-200/50 transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-blue-200/40 active:scale-95 active:duration-75 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:ring-offset-1"
                >
                    <PrinterIcon className="size-5 text-blue-600 transition-all duration-300 ease-out group-hover:text-blue-700 group-hover:scale-110" />
                </Button>


                {/* Botón Retornar */}
                {params.row.sale_type !== "return" ? (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => router.visit(`/pos/${params.row.id}/return`)}
                        className="group rounded-full border border-transparent bg-gradient-to-br from-orange-50 to-orange-100/80 hover:from-orange-100 hover:to-orange-200/90 hover:border-orange-200/50 transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-orange-200/40 active:scale-95 active:duration-75 focus:outline-none focus:ring-2 focus:ring-orange-300/50 focus:ring-offset-1"
                    >
                        <div className="relative">
                            <Package className="size-5" />
                            <Undo2 className="size-2 absolute -bottom-0.5 -right-1" />
                        </div>
                    </Button>

                ) : (
                    <Button
                        size="icon"
                        variant="ghost"
                        disabled
                        className=" rounded-full border border-gray-200/50 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-50 cursor-not-allowed"
                    >
                        <KeyboardReturnIcon className="h-4 w-4 text-gray-400" />
                    </Button>
                )}

                {/* Botón Eliminar */}
                {dayjs(params.row.created_at).isSame(dayjs(), 'day') && (

                    <Button
                        size="icon"
                        variant="ghost"
                        type="button"
                        onClick={() => handleRowClick(params.row, "delete")}
                        className="group rounded-full border border-transparent bg-gradient-to-br from-orange-50 to-orange-100/80 hover:from-orange-100 hover:to-orange-200/90 hover:border-orange-200/50 transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-orange-200/40 active:scale-95 active:duration-75 focus:outline-none focus:ring-2 focus:ring-orange-300/50 focus:ring-offset-1"
                    >
                        <CircleXIcon className="size-5 text-red-600 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-90" />
                    </Button>

                )}
            </div>
        ),
    },
];

export default function Sale({ sales, contacts }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [amountLimit, setAmountLimit] = useState(0);
    const [dataSales, setDataSales] = useState(sales);
    const selectRef = useRef(null);

    const [searchTerms, setSearchTerms] = useState({
        start_date: '',
        end_date: '',
        store: 0,
        contact_id: '',
        status: 'all',
        query: '',
        per_page: 10,
    });

    const handleRowClick = (sale, action) => {
        setSelectedTransaction(sale);
        switch (action) {
            case "add_payment":
                const amountLimit = Math.max(
                    0,
                    (parseFloat(sale.total_amount) - parseFloat(sale.amount_received)).toFixed(2)
                );
                setSelectedContact(sale.contact_id);
                setAmountLimit(amountLimit);
                setPaymentModalOpen(true);
                break;
            case "view_details":
                setViewDetailsModalOpen(true);
                break;
            case "delete":
                deleteSale(sale.id);
                break;
            default:
        }
    };

    const deleteSale = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/sales/${id}`)
                    .then(response => {
                        Swal.fire('Deleted!', 'The sale has been deleted.', 'success');
                        refreshSales(window.location.pathname)
                        // Optionally refresh the sales data or update the UI here
                    })
                    .catch(error => {
                        Swal.fire('Error!', error.response.data.error, 'error');
                    });

            }
        });
    };

    const refreshSales = (url) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["sales", "contacts"], // Only reload specified properties
            onSuccess: (response) => {
                setDataSales(response.props.sales);
            },
        };
        router.get(
            url, { ...searchTerms },
            options
        );
    };

    useEffect(() => {
        refreshSales(window.location.pathname);
    }, [searchTerms]);


    const handleSearchChange = (input) => {

        if (input?.target) {
            // Handle regular inputs (e.g., TextField)
            const { name, value } = input.target;
            setSearchTerms((prev) => ({ ...prev, [name]: value }));
        } else {
            // Handle Select2 inputs (e.g., contact selection)
            setSearchTerms((prev) => ({
                ...prev,
                contact_id: input?.id, // Store selected contact or null
            }));
        }
    };


    const handleReset = () => {
        setSearchTerms({
            start_date: '',
            end_date: '',
            store: 0,
            contact_id: '',
            status: 'all',
            query: '',
            per_page: 100,
        });
        // Limpiar el Select2
        if (selectRef.current) {
            selectRef.current.clearValue();
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sales" />

            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent={"end"}
                sx={{ width: "100%" }}
                size={12}
            >
                <Grid size={{ xs: 12, sm: 3 }}>
                    <Select2
                        ref={selectRef}
                        className="w-full"
                        placeholder="Elija un cliente"
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                height: "55px",
                            }),
                        }}
                        options={contacts} // Options to display in the dropdown
                        onChange={(selectedOption) => handleSearchChange(selectedOption)}
                        isClearable // Allow the user to clear the selected option
                        getOptionLabel={(option) => option.name + ' | ' + option.balance}
                        getOptionValue={(option) => option.id}
                    ></Select2>
                </Grid>

                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        value={searchTerms.status}
                        label="Estado Venta"
                        onChange={handleSearchChange}
                        name="status"
                        select
                        fullWidth
                    >
                        <MenuItem value={"all"}>Todos</MenuItem>
                        <MenuItem value={"completed"}>Completed</MenuItem>
                        <MenuItem value={"pending"}>Pending</MenuItem>
                    </TextField>
                </Grid>

                <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                        label="Fecha Inicio"
                        name="start_date"
                        placeholder="Start Date"
                        fullWidth
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={searchTerms.start_date}
                        onChange={handleSearchChange}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                        label="Fecha Fin"
                        name="end_date"
                        placeholder="End Date"
                        fullWidth
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={searchTerms.end_date}
                        onChange={handleSearchChange}
                        required
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        value={searchTerms.query}
                        label="Buscar"
                        onChange={handleSearchChange}
                        name="query"
                        fullWidth
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevents form submission if inside a form
                                refreshSales(window.location.pathname); // Trigger search on Enter
                            }
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 1 }}>
                    <Tooltip title="Limpiar filtros">
                        <Button
                            variant="default"
                            onClick={handleReset}
                            size="lg"
                            className="w-full"
                        >
                            <FunnelXIcon />
                        </Button>
                    </Tooltip>
                </Grid>

            </Grid>

            <Box
                className="py-6 w-full"
                sx={{ display: "grid", gridTemplateColumns: "1fr", height: "calc(100vh - 195px)", }}
            >
                <DataGrid
                    rows={dataSales.data}
                    columns={columns(handleRowClick)}
                    columnVisibilityModel={{
                        amount_received: false,
                        discount: false,
                        total_amount: false,
                        change: false,
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    hideFooter
                />
            </Box>
            <Grid size={12} spacing={2} container justifyContent={"end"}>
                <Chip size="large" label={'Total results : ' + dataSales.total} color="primary" />
                <TextField
                    label="Per page"
                    value={searchTerms.per_page}
                    onChange={handleSearchChange}
                    name="per_page"
                    select
                    size="small"
                    sx={{ minWidth: '100px' }}
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </TextField>
                <CustomPagination
                    dataLinks={dataSales?.links}
                    next_page={dataSales.next_page_url}
                    prev_page={dataSales?.prev_page_url}
                    current_page={dataSales?.current_page}
                    refreshTable={refreshSales}
                    dataLastPage={dataSales?.last_page}
                ></CustomPagination>
            </Grid>

            <AddPaymentDialog
                open={paymentModalOpen}
                setOpen={setPaymentModalOpen}
                selectedTransaction={selectedTransaction}
                selectedContact={selectedContact}
                amountLimit={amountLimit}
                is_customer={true}
                refreshTable={refreshSales}
            />
            <ViewDetailsDialog
                open={viewDetailsModalOpen}
                setOpen={setViewDetailsModalOpen}
                type={"sale"}
                selectedTransaction={selectedTransaction?.id}
            />
        </AuthenticatedLayout>
    );
}
