export interface Resident {
  id: string;
  name: string;
  joinDate: string;
}

export interface MealRecord {
  id:string;
  residentId: string;
  date: string; // YYYY-MM-DD
  mealCount: number;
}

export interface MarketRecord {
  id: string;
  residentId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  description: string;
}

// NEW: Defines the structure for a bill record
export interface BillRecord {
  id: string;
  name: string;
  amount: number;
  date: string; // YYYY-MM-DD
}

// MODIFIED: Updated to include bills and their functions
export interface DataContextType {
  residents: Resident[];
  meals: MealRecord[];
  market: MarketRecord[];
  bills: BillRecord[]; // <-- ADDED
  addResident: (name: string) => Promise<void>;
  deleteResident: (id: string) => Promise<void>;
  updateMealRecord: (residentId: string, date: string, mealCount: number) => Promise<void>;
  addMarketRecord: (record: Omit<MarketRecord, 'id'>) => Promise<void>;
  deleteMarketRecord: (id: string) => Promise<void>;
  addBill: (record: Omit<BillRecord, 'id'>) => Promise<void>; // <-- ADDED
  deleteBill: (id: string) => Promise<void>; // <-- ADDED
}