import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

export interface ApprovalItem {
  product: Product;
  status: 'approved' | 'rejected';
  reason?: string;
  approvedAt: Date;
  approvedBy?: string;
}

interface ApprovalsContextType {
  approvals: ApprovalItem[];
  approveProduct: (product: Product) => void;
  rejectProduct: (product: Product, reason: string) => void;
  removeApproval: (productId: string) => void;
  getApprovalStatus: (productId: string) => ApprovalItem | undefined;
  isApproved: (productId: string) => boolean;
  isRejected: (productId: string) => boolean;
  clearApprovals: () => void;
}

const ApprovalsContext = createContext<ApprovalsContextType | undefined>(undefined);

export function ApprovalsProvider({ children }: { children: ReactNode }) {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);

  const approveProduct = (product: Product) => {
    setApprovals((prev) => {
      const filtered = prev.filter((a) => a.product.id !== product.id);
      return [...filtered, {
        product,
        status: 'approved',
        approvedAt: new Date(),
      }];
    });
  };

  const rejectProduct = (product: Product, reason: string) => {
    setApprovals((prev) => {
      const filtered = prev.filter((a) => a.product.id !== product.id);
      return [...filtered, {
        product,
        status: 'rejected',
        reason,
        approvedAt: new Date(),
      }];
    });
  };

  const removeApproval = (productId: string) => {
    setApprovals((prev) => prev.filter((a) => a.product.id !== productId));
  };

  const getApprovalStatus = (productId: string) => {
    return approvals.find((a) => a.product.id === productId);
  };

  const isApproved = (productId: string) => {
    const approval = approvals.find((a) => a.product.id === productId);
    return approval?.status === 'approved';
  };

  const isRejected = (productId: string) => {
    const approval = approvals.find((a) => a.product.id === productId);
    return approval?.status === 'rejected';
  };

  const clearApprovals = () => {
    setApprovals([]);
  };

  return (
    <ApprovalsContext.Provider
      value={{
        approvals,
        approveProduct,
        rejectProduct,
        removeApproval,
        getApprovalStatus,
        isApproved,
        isRejected,
        clearApprovals,
      }}
    >
      {children}
    </ApprovalsContext.Provider>
  );
}

export function useApprovals() {
  const context = useContext(ApprovalsContext);
  if (!context) {
    throw new Error('useApprovals must be used within an ApprovalsProvider');
  }
  return context;
}
