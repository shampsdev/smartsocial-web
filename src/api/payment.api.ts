import { Buyer } from '@/types/cart/buyer.interface';
import { PaymentStatus } from '@/types/client/payment-status.interface';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const createPayment = (cart_id: number, buyer: Buyer) => {
  axios.post(`${apiUrl}/api/v1/payments/create/`, {
    cart_id: cart_id,
    buyer: buyer,
  });
};

export const getPaymentStatus = async (payment_id: string): Promise<PaymentStatus> => {
  const result = await axios.get<PaymentStatus>(
    `${apiUrl}/api/v1/payments/check/${payment_id}/`
  );

  return result.data;
};
