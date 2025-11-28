
import { useContext } from 'react';
import { TokenSaleContext } from '../contexts/TokenSaleContext';

export default function useTokenSalesContext() {
  const context = useContext(TokenSaleContext);
  if (context === undefined) {
    throw new Error('useTokenSalesContext must be used within a TokenSaleProvider');
  }
  return context;
}