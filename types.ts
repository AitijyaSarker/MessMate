// src/types.ts

export interface Resident {
  id: string;
  name: string;
  joinDate: string;
  group_id: string; // <-- ADD THIS
}

export interface MealRecord {
  id:string;
  residentId: string;
  date: string;
  mealCount: number;
  group_id: string; // <-- ADD THIS
}

export interface MarketRecord {
  id: string;
  residentId: string;
  date: string;
  amount: number;
  description: string;
  group_id: string; // <-- ADD THIS
}

export interface BillRecord {
  id: string;
  name: string;
  amount: number;
  date: string;
  group_id: string; // <-- ADD THIS
}

export interface DataContextType {
  residents: Resident[];
  meals: MealRecord[];
  market: MarketRecord[];
  bills: BillRecord[];
  addResident: (name: string) => Promise<void>;
  deleteResident: (id: string) => Promise<void>;
  updateMealRecord: (residentId: string, date: string, mealCount: number) => Promise<void>;
  // MODIFIED: Omit 'group_id' as it will be added by the function
  addMarketRecord: (record: Omit<MarketRecord, 'id' | 'group_id'>) => Promise<void>; 
  deleteMarketRecord: (id: string) => Promise<void>;
  // MODIFIED: Omit 'group_id' as it will be added by the function
  addBill: (record: Omit<BillRecord, 'id' | 'group_id'>) => Promise<void>; 
  deleteBill: (id: string) => Promise<void>;
}