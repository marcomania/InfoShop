import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';

export interface CartItem {
    id: number | string;
    batch_number?: string;
    product_type?: string;
    quantity: number;
    price?: number | string;
    cost?: number | string;
    discount?: number | string;
    [key: string]: any;
}

interface CartState {
    cartState: CartItem[];
    heldCarts: Record<string, CartItem[]>;
    addToCart: (item: CartItem, quantity?: number) => void;
    removeFromCart: (index: number) => void;
    updateProductQuantity: (itemId: number | string, batchNumber: string, newQuantity: number, cart_index: number) => void;
    updateCartItem: (item: CartItem & { cart_index?: number }) => void;
    emptyCart: () => void;
    holdCart: () => void;
    setHeldCartToCart: (key: string) => void;
    removeHeldItem: (key: string) => void;
}

const createCartStore = (name: string) => create<CartState>()(
    persist(
        (set, get) => ({
            cartState: [],
            heldCarts: {},

            addToCart: (item, quantity = 1) => {
                set((state) => {
                    const cart = [...state.cartState];
                    const existingProductIndex = cart.findIndex(
                        (cartItem) =>
                            cartItem.id === item.id &&
                            cartItem.batch_number === item.batch_number &&
                            (cartItem.product_type !== 'custom' && cartItem.product_type !== 'reload')
                    );

                    if (existingProductIndex !== -1) {
                        cart[existingProductIndex].quantity = parseFloat(cart[existingProductIndex].quantity as any) + quantity;
                    } else {
                        const productToAdd = { ...item, quantity: quantity };
                        cart.push(productToAdd);
                    }
                    return { cartState: cart };
                });
            },

            removeFromCart: (index) => {
                set((state) => {
                    const cart = [...state.cartState];
                    cart.splice(index, 1);
                    return { cartState: cart };
                });
            },

            updateProductQuantity: (itemId, batchNumber, newQuantity, cart_index) => {
                set((state) => {
                    const cart = [...state.cartState];
                    const existingProductIndex = cart_index;

                    if (existingProductIndex !== -1 && cart[existingProductIndex]) {
                        cart[existingProductIndex].quantity = newQuantity;
                        if (newQuantity <= 0) {
                            cart.splice(existingProductIndex, 1);
                        }
                    }
                    return { cartState: cart };
                });
            },

            updateCartItem: (item) => {
                set((state) => {
                    const cart = [...state.cartState];
                    const existingProductIndex = item.cart_index ?? -1;

                    if (existingProductIndex !== -1 && cart[existingProductIndex]) {
                        const updatedItem = { ...item };
                        cart[existingProductIndex] = updatedItem;

                        if (updatedItem.quantity <= 0) {
                            cart.splice(existingProductIndex, 1);
                        }
                    } else {
                        cart.push({
                            ...item,
                            quantity: item.quantity ?? 1,
                        });
                    }
                    return { cartState: cart };
                });
            },

            emptyCart: () => {
                set({ cartState: [] });
            },

            holdCart: () => {
                set((state) => {
                    const currentDateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
                    const newKey = currentDateTime;
                    const newHeldCarts = { ...state.heldCarts, [newKey]: [...state.cartState] };
                    return { heldCarts: newHeldCarts, cartState: [] };
                });
            },

            setHeldCartToCart: (key) => {
                set((state) => {
                    const cart = state.heldCarts[key] || [];
                    if (cart.length > 0) {
                        const newHeldCarts = { ...state.heldCarts };
                        delete newHeldCarts[key];
                        return { cartState: cart, heldCarts: newHeldCarts };
                    }
                    return state;
                });
            },

            removeHeldItem: (key) => {
                set((state) => {
                    const newHeldCarts = { ...state.heldCarts };
                    delete newHeldCarts[key];
                    return { heldCarts: newHeldCarts };
                });
            },
        }),
        {
            name: name,
        }
    )
);

export const usePurchaseCartStore = createCartStore('purchase_cart');
export const useSalesCartStore = createCartStore('sales_cart');
export const useSalesReturnCartStore = createCartStore('sales_return_cart');
