
import React, { createContext, ReactNode } from 'react';
import useTokenSales from '../hooks/useTokenSales';

// Define the shape of the context by inferring the return type of the main logic hook.
export type ITokenSaleContext = ReturnType<typeof useTokenSales>;

export const TokenSaleContext = createContext<ITokenSaleContext | undefined>(undefined);

export const TokenSaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const tokenSales = useTokenSales();

    return <TokenSaleContext.Provider value={tokenSales}>{children}</TokenSaleContext.Provider>;
};
