import React, { useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { format  } from "date-fns";
import { usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react"
import { CurrencyInput } from "./ui/currency-input";
import { SharedData } from '@/types';
import { useTransactionMutation } from "@/hooks/useTransactionMutation";
import { DateSelector } from "./ui/date-selector";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";

const formSchema = z.object({
    amount: z.number(),
    payment_method: z.enum(['Cash', 'Cheque', 'Card', 'Bank', 'Account Balance']),
    transaction_date: z.date(),
    note: z.string(),
    store_id: z.number(),
    contact_id: z.number(),
    transaction_id: z.number().nullable(),
})

interface SelectedTransaction {
    id: number;
    contact_id: number;
    sale_date: string;
    total_amount: string;
    discount: string;
    amount_received: string;
    profit_amount: string;
    status: string;
    payment_status: string;
    name: string;
    balance: string;
    store_id: number;
    invoice_number: string;
    sale_type: string;
    created_at: string;
}
interface Store {
    id: number;
    name: string;
}

interface AddPaymentDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedContact: number;
    selectedTransaction: SelectedTransaction | null;
    amountLimit?: number;
    is_customer?: boolean;
    stores: Store[] | null;
    refreshTable: (url: string) => void;
}

export default function AddPaymentDialog({
    open,
    setOpen,
    selectedContact,
    selectedTransaction = null,
    amountLimit,
    is_customer = false,
    stores = null,
    refreshTable
}: AddPaymentDialogProps) {
    const { currency_symbol } = usePage<SharedData>().props.settings;
    const submitterRef = useRef<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            payment_method: 'Cash',
            transaction_date: new Date(),
            note: "",
            store_id: 1,
            contact_id: 0,
            transaction_id: null,
        },
        mode: "onSubmit",
    })

    useEffect(() => {
        const defaultStoreId =
            selectedTransaction?.store_id ??
            (stores && stores.length > 0 ? stores[0].id : 1);
        console.log ("Params", selectedTransaction, selectedContact, defaultStoreId, amountLimit);
        form.reset({
            amount: amountLimit ?? 0,
            payment_method: 'Cash',
            transaction_date: new Date(),
            note: "",
            store_id: defaultStoreId,
            contact_id: selectedContact,
            transaction_id: selectedTransaction?.id ?? null,
        });

    }, [selectedTransaction, selectedContact, stores]);

    const amount = form.watch("amount");
    const payment_method = form.watch("payment_method");

    const getButtonText = () => {
        const paymentLogicMap: Record<string, (amount: number) => string> = {
            Cash: (amount) => (amount < 0 ? 'REFUND' : 'PAY'),
            Cheque: (amount) => (amount < 0 ? 'REFUND' : 'PAY'),
            'Account Balance': (amount) => (amount < 0 ? 'CREDIT' : 'UPDATE BALANCE'),
        };

        return paymentLogicMap[payment_method]?.(amount) ?? 'ADD PAYMENT';
    };

    const { mutate, isPending } = useTransactionMutation(is_customer);

    useEffect(() => {
        if (!open) {
            submitterRef.current = null; // Reset the submitter when dialog is closed
            form.reset();
        }
    }, [open]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedValues = {
            ...values,
            transaction_date: format(new Date(values.transaction_date), "yyyy-MM-dd"),
        };

        const action = submitterRef.current;
        if (action === "credit") {
            formattedValues.amount = -Math.abs(formattedValues.amount);
        }

        mutate(formattedValues, {
            onSuccess: () => {
                refreshTable(window.location.pathname);
                setOpen(false);
            }
        });
    }

    return (
        <React.Fragment>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg" >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(
                            onSubmit,
                            (errors) => {
                                console.log("❌ Form validation errors:", errors);
                            }
                        )} className="space-y-8">
                            <DialogHeader>
                                <DialogTitle>ADD PAYMENTS</DialogTitle>
                                <DialogDescription>
                                    Completa los detalles para agregar el nuevo pago.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-start">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <CurrencyInput
                                                    {...field}
                                                    id="amount"
                                                    placeholder="0.00"
                                                    className=""
                                                    currency={currency_symbol}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="payment_method"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Theme" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Cash">Cash</SelectItem>
                                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                                    <SelectItem value="Card">Card</SelectItem>
                                                    <SelectItem value="Bank">Bank</SelectItem>
                                                    {selectedTransaction === null && (
                                                        <SelectItem value="Account Balance">Account Balance</SelectItem>
                                                    )}
                                                    {selectedTransaction !== null && (
                                                        <SelectItem value="Account">Account</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="transaction_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de inicio</FormLabel>
                                            <FormControl>
                                                <DateSelector
                                                    {...field}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="dd/mm/aaaa"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {(selectedTransaction === null || amountLimit === undefined) && (
                                    <FormField
                                        control={form.control}
                                        name="store_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Store</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(Number(value));
                                                    }}
                                                    value={String(field.value)}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Store" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {stores?.map((store) => (
                                                            <SelectItem key={store.id} value={String(store.id)} >
                                                                {store.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-1">
                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Note" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    variant={"default"}
                                    size={"lg"}
                                    className="flex-1"
                                    disabled={amount === 0 || (amountLimit !== undefined && amount > amountLimit) || isPending}
                                    color={amount < 0 ? "secondary" : "primary"}
                                    type="submit"
                                    onClick={() => (submitterRef.current = "pay")}
                                >
                                    {isPending ? (
                                        <span className="flex items-center">
                                            <Loader2Icon className="animate-spin mr-2" /> Loading...
                                        </span>
                                    ) : (
                                        getButtonText()
                                    )}
                                </Button>
                                {(selectedTransaction === null && amount >= 0) && (
                                    <Button
                                        variant={"default"}
                                        size={"lg"}
                                        className="flex-1"
                                        color={"error"}
                                        type="submit"
                                        disabled={amount == 0 || (amountLimit !== undefined && amount > amountLimit) || isPending}
                                        onClick={() => (submitterRef.current = "credit")}
                                    >
                                        {isPending ? 'Loading...' : (payment_method === 'Cash' || payment_method === 'Cheque' ? 'REFUND' : 'CREDIT')}
                                    </Button>
                                )}
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
