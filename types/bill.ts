export interface Bill {
  id: number;
  amount: number;
  dueDate: Date;
  paymentType: "PIX" | "BOLETO";
  paymentCode?: string;
  currency: string; // Corrigido para minúscula
  status: "PENDING" | "RESERVED" | "PAID" | "EXPIRED" | "CANCELLED";
  bonusRate: number;
  uploadedBy: number; // Corrigido para `number`
  reservedBy?: number; // Corrigido para `number`
  reservedUntil?: Date;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  totalUploaded: number;
  totalPaid: number;
  averageRating: number;
}

export interface Rating {
  id: number;
  rating: number;
  comment?: string;
  billId: number;
  raterId: number;
}
