import React, { createContext, useContext, useMemo, useState } from 'react';
import useCartBase from './useCartBase';

const SalesContext = createContext();

const SalesProvider = ({ children, cartType = 'sales_cart'}) => {

  const { cartState, addToCart, removeFromCart, updateProductQuantity, emptyCart, updateCartItem, holdCart, setHeldCartToCart, removeHeldItem } = useCartBase(cartType);

  const { cartTotal, totalQuantity, totalProfit } = useMemo(() => {
    const result = cartState.reduce(
      (acc, item) => {
        const quantity = parseFloat(item.quantity.toFixed(3))
        const cost = parseFloat(item.cost)
        const discountedPrice = parseFloat(item.price) - parseFloat(item.discount);
        const itemTotal = parseFloat((discountedPrice * quantity).toFixed(2));
        const itemProfit = parseFloat(((discountedPrice - cost) * quantity).toFixed(2));

        acc.cartTotal += itemTotal;
        acc.totalQuantity += quantity;
        acc.totalProfit += itemProfit;

        return acc;
      },
      { cartTotal: 0, totalQuantity: 0, totalProfit: 0 });

      result.cartTotal = parseFloat(result.cartTotal.toFixed(1));
      result.totalProfit = parseFloat(result.totalProfit.toFixed(1));

      return result;
  }, [cartState]);

  return (
      <SalesContext.Provider
          value={{
              cartState,
              cartTotal,
              totalQuantity,
              totalProfit,
              addToCart,
              removeFromCart,
              updateProductQuantity,
              emptyCart,
              updateCartItem,
              holdCart,
              setHeldCartToCart,
              removeHeldItem,
          }}
      >
          {children}
      </SalesContext.Provider>
  );
};

const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};

export { SalesProvider, useSales };
