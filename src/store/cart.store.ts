import { reactive, watch, nextTick } from 'vue';
import { CartTicket } from '@/types/cart/cart-ticket.interface';
import { updateCart } from '@/api/cart.api';

let isUpdating = false;

type CartStatus = 'contents' | 'payment' | 'widget';
export interface CartProps {
  id: number | null;
  visible: boolean;
  status: CartStatus;
  tickets: CartTicket[];
}

const loadCartFromLocalStorage = (): CartProps => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
    }
  }
  return {
    id: null,
    visible: false,
    status: 'contents',
    tickets: [],
  };
};

export const cart = reactive<CartProps>(loadCartFromLocalStorage());

watch(
  () => cart,
  async (newCart) => {
    if (isUpdating) return;
    isUpdating = true;

    newCart.tickets = cart.tickets.filter((ticket) => ticket.quantity > 0);
    newCart = {
      ...newCart,
      ...(await updateCart(newCart)),
    };

    newCart.visible = cart.visible;

    localStorage.setItem('cart', JSON.stringify(newCart));

    nextTick(() => {
      isUpdating = false;
    });

    console.log(newCart);
    console.log(cart);
  },
  { deep: true }
);

watch(
  () => cart.visible,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
);
