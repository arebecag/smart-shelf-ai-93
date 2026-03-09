import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

export interface SimulatorEntry {
  product: Product;
  proposedPrice: number;
  addedAt: Date;
  savedAt?: Date;
  status: 'draft' | 'pending_approval' | 'approved';
  notes?: string;
}

interface SimulatorContextType {
  queue: SimulatorEntry[];
  addToSimulator: (product: Product) => void;
  removeFromSimulator: (productId: string) => void;
  updateProposedPrice: (productId: string, price: number) => void;
  submitForApproval: (productId: string, notes?: string) => void;
  getEntry: (productId: string) => SimulatorEntry | undefined;
  isInSimulator: (productId: string) => boolean;
  clearSimulator: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<SimulatorEntry[]>([]);

  const addToSimulator = (product: Product) => {
    setQueue(prev => {
      if (prev.find(e => e.product.id === product.id)) return prev;
      return [...prev, {
        product,
        proposedPrice: product.price,
        addedAt: new Date(),
        status: 'draft',
      }];
    });
  };

  const removeFromSimulator = (productId: string) => {
    setQueue(prev => prev.filter(e => e.product.id !== productId));
  };

  const updateProposedPrice = (productId: string, price: number) => {
    setQueue(prev => prev.map(e =>
      e.product.id === productId ? { ...e, proposedPrice: price } : e
    ));
  };

  const submitForApproval = (productId: string, notes?: string) => {
    setQueue(prev => prev.map(e =>
      e.product.id === productId
        ? { ...e, status: 'pending_approval', savedAt: new Date(), notes }
        : e
    ));
  };

  const getEntry = (productId: string) => queue.find(e => e.product.id === productId);

  const isInSimulator = (productId: string) => queue.some(e => e.product.id === productId);

  const clearSimulator = () => setQueue([]);

  return (
    <SimulatorContext.Provider value={{
      queue, addToSimulator, removeFromSimulator,
      updateProposedPrice, submitForApproval,
      getEntry, isInSimulator, clearSimulator,
    }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error('useSimulator must be used within SimulatorProvider');
  return ctx;
}
