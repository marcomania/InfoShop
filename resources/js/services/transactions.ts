import axios from "axios";

export const createTransaction = async ({
  data,
  isCustomer,
}: {
  data: any;
  isCustomer: boolean;
}) => {
  const url = isCustomer ? "/customer-transaction" : "/vendor-transaction";
  const response = await axios.post(url, data)
  return response.data;
};
