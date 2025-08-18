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

// MODIFIED: The DataProvider now accepts an `isGuest` prop to know which mode to operate in.
const DataProvider: React.FC<{ children: ReactNode; isGuest: boolean }> = ({ children, isGuest }) => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [meals, setMeals] = useState<MealRecord[]>([]);
    const [market, setMarket] = useState<MarketRecord[]>([]);
    const [bills, setBills] = useState<BillRecord[]>([]);

    const fetchDataForCurrentUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile, error: profileError } = await supabase.from('profiles').select('group_id').eq('id', user.id).single();
            if (profileError || !profile || !profile.group_id) {
                console.error("Could not find a group for the current user.", profileError);
                setResidents([]); setMeals([]); setMarket([]); setBills([]);
                return;
            }
            const groupId = profile.group_id;

            const [residentsRes, mealsRes, marketRes, billsRes] = await Promise.all([
                supabase.from('residents').select('*').eq('group_id', groupId),
                supabase.from('meals').select('*').eq('group_id', groupId),
                supabase.from('market').select('*').eq('group_id', groupId),
                supabase.from('bills').select('*').eq('group_id', groupId)
            ]);

            setResidents(residentsRes.data || []);
            setMeals(mealsRes.data || []);
            setMarket(marketRes.data || []);
            setBills(billsRes.data || []);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // THIS useEffect is now corrected to handle both modes properly.
    useEffect(() => {
        if (isGuest) {
            // In Guest Mode, set initial sample data and do nothing else.
            setResidents([{id: 'guest-1', name: 'John Doe (Guest)', joinDate: new Date().toISOString().split('T')[0], group_id: 'guest'}]);
            setMeals([]);
            setMarket([]);
            setBills([]);
        } else {
            // For real users, fetch data from Supabase.
            fetchDataForCurrentUser();
        }
    }, [isGuest]); // This key dependency ensures it re-runs when you switch between guest and real user.

    const getCurrentGroupId = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        const { data: profile } = await supabase.from('profiles').select('group_id').eq('id', user.id).single();
        return profile?.group_id || null;
    };

    // --- DATA MODIFICATION FUNCTIONS ---
    // Each function has a simple check for `isGuest`.
    const addResident = async (name: string) => {
        if (isGuest) {
            const newResident = { id: Date.now().toString(), name, joinDate: new Date().toISOString().split('T')[0], group_id: 'guest' };
            setResidents(prev => [...prev, newResident]);
            return;
        }
        const groupId = await getCurrentGroupId();
        if (!groupId) { console.error("Cannot add resident: no group ID found."); return; }
        const { error } = await supabase.from('residents').insert([{ name, joinDate: new Date().toISOString().split('T')[0], group_id: groupId }]);
        if (error) console.error("Error adding resident:", error);
        else await fetchDataForCurrentUser();
    };
    
    const deleteResident = async (id: string) => {
        if (isGuest) {
            setResidents(prev => prev.filter(r => r.id !== id)); return;
        }
        if (window.confirm('Are you sure? This will also delete all their meal and market records.')) {
            const { error } = await supabase.from('residents').delete().eq('id', id);
            if (error) console.error("Error deleting resident:", error);
            else await fetchDataForCurrentUser();
        }
    };

    const updateMealRecord = async (residentId: string, date: string, mealCount: number) => {
        if (isGuest) {
            const existingIndex = meals.findIndex(m => m.residentId === residentId && m.date === date);
            if (mealCount > 0) {
                if (existingIndex > -1) {
                    const updatedMeals = [...meals];
                    updatedMeals[existingIndex] = { ...updatedMeals[existingIndex], mealCount };
                    setMeals(updatedMeals);
                } else {
                    setMeals(prev => [...prev, { id: Date.now().toString(), residentId, date, mealCount, group_id: 'guest' }]);
                }
            } else if (existingIndex > -1) {
                setMeals(prev => prev.filter(m => !(m.residentId === residentId && m.date === date)));
            }
            return;
        }
        const groupId = await getCurrentGroupId();
        if (!groupId) return;
        const existing = meals.find(m => m.residentId === residentId && m.date === date);
        if (mealCount > 0) {
          if (existing) { await supabase.from('meals').update({ mealCount }).eq('id', existing.id); } 
          else { await supabase.from('meals').insert([{ residentId, date, mealCount, group_id: groupId }]); }
        } else if (existing) { await supabase.from('meals').delete().eq('id', existing.id); }
        await fetchDataForCurrentUser();
    };

    const addMarketRecord = async (record: Omit<MarketRecord, 'id' | 'group_id'>) => {
        if (isGuest) {
            setMarket(prev => [{...record, id: Date.now().toString(), group_id: 'guest'}, ...prev]);
            return;
        }
        const groupId = await getCurrentGroupId();
        if (!groupId) return;
        await supabase.from('market').insert([{ ...record, group_id: groupId }]);
        await fetchDataForCurrentUser();
    };

    const deleteMarketRecord = async (id: string) => {
        if (isGuest) {
            setMarket(prev => prev.filter(m => m.id !== id));
            return;
        }
        await supabase.from('market').delete().eq('id', id);
        await fetchDataForCurrentUser();
    };

    const addBill = async (record: Omit<BillRecord, 'id' | 'group_id'>) => {
        if (isGuest) {
            setBills(prev => [{...record, id: Date.now().toString(), group_id: 'guest'}, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            return;
        }
        const groupId = await getCurrentGroupId();
        if (!groupId) return;
        await supabase.from('bills').insert([{ ...record, group_id: groupId }]);
        await fetchDataForCurrentUser();
    };

    const deleteBill = async (id: string) => {
        if (isGuest) {
            setBills(prev => prev.filter(b => b.id !== id));
            return;
        }
        await supabase.from('bills').delete().eq('id', id);
        await fetchDataForCurrentUser();
    };

    const value = { residents, meals, market, bills, addResident, deleteResident, updateMealRecord, addMarketRecord, deleteMarketRecord, addBill, deleteBill };
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

// --- MAIN APP COMPONENT ---
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
    // We pass the isGuest prop here, which controls the entire DataProvider's behavior.
    <DataProvider isGuest={isGuest}>
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