import React, { createContext, useState } from 'react';
import { useDate } from '@/hooks/useDate';
// Create SharedContext
export const SharedContext = createContext();

// SharedProvider component
export const SharedProvider = ({ children }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);  // Shared customer state
    const [selectedVendor, setSelectedVendor] = useState(null);  // Shared Vendor state

    const [cartItemModalOpen, setCartItemModalOpen] = useState(false)
    const [selectedCartItem, setSelectedCartItem] = useState(null)
    const [selectedLabel, setSelectedLabel] = useState('');

    const { formatDate } = useDate();
    const [saleDate, setSaleDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));

    return (
        <SharedContext.Provider
            value={{
                selectedCustomer,
                setSelectedCustomer,
                selectedVendor,
                setSelectedVendor,
                cartItemModalOpen,
                setCartItemModalOpen,
                selectedCartItem,
                setSelectedCartItem,
                selectedLabel,
                setSelectedLabel,
                saleDate,
                setSaleDate
            }}
        >
            {children}
        </SharedContext.Provider>
    );
  };