// src/App.tsx

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import type { Resident, MealRecord, MarketRecord, BillRecord, DataContextType } from './types';
import { Session, User } from '@supabase/supabase-js'; 
import { supabase } from './supabaseClient';

// --- IMPORTS ---
import { DashboardPage, ResidentsPage, RecordsPage, ReportsPage, CalculationPage } from './pages';
import LoginPage from './LoginPage';
import { DashboardIcon, UsersIcon, ClipboardIcon, ChartBarIcon, CalculatorIcon } from './components';
import { FooterCredit } from './Footercredit'; 

// --- DATA CONTEXT ---
const DataContext = createContext<DataContextType | undefined>(undefined);


const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [meals, setMeals] = useState<MealRecord[]>([]);
    const [market, setMarket] = useState<MarketRecord[]>([]);
    const [bills, setBills] = useState<BillRecord[]>([]); 
    useEffect(() => {
      supabase.from('residents').select('*').then(({ data }) => setResidents(data || []));
      supabase.from('meals').select('*').then(({ data }) => setMeals(data || []));
      supabase.from('market').select('*').then(({ data }) => setMarket(data || []));
      supabase.from('bills').select('*').then(({ data }) => setBills(data || [])); 
    }, []);
  
    const addResident = async (name: string) => {
      const { data } = await supabase.from('residents').insert([{ name, joinDate: new Date().toISOString().split('T')[0] }]).select();
      if (data) setResidents(prev => [...prev, ...data]);
    };
    
    const deleteResident = async (id: string) => {
      if (window.confirm('Are you sure? This will also delete all their meal and market records.')) {
        await supabase.from('residents').delete().eq('id', id);
        setResidents(prev => prev.filter(r => r.id !== id));
        setMeals(prev => prev.filter(m => m.residentId !== id));
        setMarket(prev => prev.filter(m => m.residentId !== id));
      }
    };

    const updateMealRecord = async (residentId: string, date: string, mealCount: number) => {
      const existing = meals.find(m => m.residentId === residentId && m.date === date);
      if (mealCount > 0) {
        if (existing) {
          await supabase.from('meals').update({ mealCount }).eq('id', existing.id);
          setMeals(prev => prev.map(m => m.id === existing.id ? { ...m, mealCount } : m));
        } else {
          const { data } = await supabase.from('meals').insert([{ residentId, date, mealCount }]).select();
          if (data) setMeals(prev => [...prev, ...data]);
        }
      } else if (existing) {
        await supabase.from('meals').delete().eq('id', existing.id);
        setMeals(prev => prev.filter(m => m.id !== existing.id));
      }
    };

    const addMarketRecord = async (record: Omit<MarketRecord, 'id'>) => {
      const { data } = await supabase.from('market').insert([record]).select();
      if (data) setMarket(prev => [ ...data, ...prev ]);
    };

    const deleteMarketRecord = async (id: string) => {
      await supabase.from('market').delete().eq('id', id);
      setMarket(prev => prev.filter(m => m.id !== id));
    };
    // --- End of your original functions ---

    const addBill = async (record: Omit<BillRecord, 'id'>) => {
      const { data, error } = await supabase.from('bills').insert([record]).select();
      if (error) {
          console.error("Error adding bill:", error);
          return;
      }
      if (data) {
         
          setBills(prev => [...data, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    };

    const deleteBill = async (id: string) => {
        const { error } = await supabase.from('bills').delete().eq('id', id);
        if (error) {
            console.error("Error deleting bill:", error);
            return;
        }
        setBills(prev => prev.filter(b => b.id !== id));
    };

 
    const value = { 
        residents, meals, market, bills, 
        addResident, deleteResident, updateMealRecord, addMarketRecord, deleteMarketRecord,
        addBill, deleteBill 
    };
    
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};

const GUEST_USER: User = {
    id: 'guest-user-id',
    email: 'guest@messmate.app',
    app_metadata: { provider: 'guest', providers: ['guest'] },
    user_metadata: { full_name: 'Guest User' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
};

// --- SIDEBAR COMPONENT ---
interface SidebarProps {
    user: User;
    onLogout: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
    const navLinkClasses = "flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors";
    const activeLinkClasses = "bg-primary-600 text-white hover:bg-primary-600";

    
    return (
        <div className="flex flex-col w-64 h-screen bg-slate-800 text-white fixed">
            <div className="flex items-center justify-center h-20 border-b border-slate-700 shrink-0">
                <img src="https://i.postimg.cc/hvKj0ww3/bunk.png" alt="MessMate Logo" className="h-10 w-10" />
                <h1 className="text-2xl font-bold ml-3">MessMate</h1>
            </div>
  
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <NavLink to="/" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}><DashboardIcon className="h-5 w-5 mr-3" /> Dashboard</NavLink>
                <NavLink to="/residents" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}><UsersIcon className="h-5 w-5 mr-3" /> Residents</NavLink>
                <NavLink to="/records" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}><ClipboardIcon className="h-5 w-5 mr-3" /> Log Records</NavLink>
                <NavLink to="/reports" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}><ChartBarIcon className="h-5 w-5 mr-3" /> Reports</NavLink>
                <NavLink to="/calculation" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}><CalculatorIcon className="h-5 w-5 mr-3" /> Calculation</NavLink>
            </nav>
        
            <div className="p-4 border-t border-slate-700 shrink-0">
                <div className="space-y-2 text-sm text-slate-300">
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="font-semibold">{user.email}</p>
                    <button
                        onClick={onLogout}
                        className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                    >
                        Logout
                    </button>
                </div>
           
                <FooterCredit 
                    name="Aitijya" 
                    link="https://github.com/AitijyaSarker" 
                />
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT  ---
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setIsGuest(false); 
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
      if (isGuest) {
          setIsGuest(false);
      } else {
          await supabase.auth.signOut();
      }
  };

  const user = session ? session.user : (isGuest ? GUEST_USER : null);

  if (!user) {
    return <LoginPage onGuestLogin={() => setIsGuest(true)} />;
  }
  

  return (
    <DataProvider>
      <HashRouter>
        <div className="flex">
          <Sidebar user={user} onLogout={handleLogout} />
          <main className="flex-1 ml-64 p-8 bg-slate-100 min-h-screen">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/residents" element={<ResidentsPage />} />
              <Route path="/records" element={<RecordsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/calculation" element={<CalculationPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </DataProvider>
  );
}