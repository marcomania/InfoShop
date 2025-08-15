import { useMutation } from "@tanstack/react-query";
import { createTransaction } from "@/services/transactions";
import Swal from "sweetalert2";
import { toast } from "sonner";

export function useTransactionMutation( isCustomer: boolean) {
  return useMutation({
    mutationFn: (data: any) => {
      toast.info("Creando transaccion", { id: "create-transaction" });
      return createTransaction( {data, isCustomer} );
    },
    onSuccess: (data) => {
      toast.success("Transaccion creada satisfactoriamente", { id: "create-transaction" });
    },
    onError: (error: any) => {
      toast.error("Error al crear la transaccion", { id: "create-transaction" });
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.error || "Unknown error",
        icon: "error",
      });
      console.error(error);
    },
  });
}
