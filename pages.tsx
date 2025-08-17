import React, { useState, useMemo } from 'react';
import { useData } from './App';
import { PageTitle, Card, StatCard, MonthlyMealChart, MarketExpenseChart, Input, Button, Select, Table, TrashIcon, UsersIcon, ClipboardIcon, ChartBarIcon, CalculatorIcon, DownloadIcon } from './components';
import { addMonths } from 'date-fns/addMonths';
import { endOfMonth } from 'date-fns/endOfMonth';
import { format } from 'date-fns/format';
import { getDate } from 'date-fns/getDate';
import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { getMonth } from 'date-fns/getMonth';
import { getYear } from 'date-fns/getYear';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { setDate } from 'date-fns/setDate';
import { startOfMonth } from 'date-fns/startOfMonth';
import { subMonths } from 'date-fns/subMonths';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';


// --- DASHBOARD PAGE ---
export const DashboardPage: React.FC = () => {
    const { residents, meals, market } = useData();

    const currentMonth = new Date();
    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthEnd = endOfMonth(currentMonth);

    const monthlyMeals = useMemo(() => meals.filter(m => isWithinInterval(new Date(m.date), { start: currentMonthStart, end: currentMonthEnd })), [meals, currentMonthStart, currentMonthEnd]);
    const monthlyMarket = useMemo(() => market.filter(m => isWithinInterval(new Date(m.date), { start: currentMonthStart, end: currentMonthEnd })), [market, currentMonthStart, currentMonthEnd]);

    const totalMonthlyMeals = monthlyMeals.reduce((sum, meal) => sum + meal.mealCount, 0);
    const totalMonthlyMarket = monthlyMarket.reduce((sum, item) => sum + item.amount, 0);

    const mealChartData = useMemo(() => residents.map(resident => ({
        name: resident.name.split(' ')[0],
        meals: monthlyMeals.filter(m => m.residentId === resident.id).reduce((sum, meal) => sum + meal.mealCount, 0),
    })).filter(d => d.meals > 0), [residents, monthlyMeals]);

    const marketChartData = useMemo(() => residents.map(resident => ({
        name: resident.name,
        value: monthlyMarket.filter(m => m.residentId === resident.id).reduce((sum, item) => sum + item.amount, 0),
    })).filter(d => d.value > 0), [residents, monthlyMarket]);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15
        }
      }
    };
    
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    };

    return (
        <>
            <PageTitle title="Dashboard" subtitle={`Overview for ${format(new Date(), 'MMMM yyyy')}`} />
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <StatCard title="Total Residents" value={residents.length} icon={<UsersIcon className="h-6 w-6"/>} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard title="Total Meals This Month" value={totalMonthlyMeals} icon={<ClipboardIcon className="h-6 w-6"/>} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard title="Market Spend This Month" value={`৳${totalMonthlyMarket.toLocaleString()}`} icon={<ChartBarIcon className="h-6 w-6"/>} />
                </motion.div>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyMealChart data={mealChartData} />
                <MarketExpenseChart data={marketChartData} />
            </div>
        </>
    );
};



export const ResidentsPage: React.FC = () => {

    const { residents, addResident, deleteResident } = useData();
    const [newName, setNewName] = useState('');

    const [animationParent] = useAutoAnimate<HTMLTableSectionElement>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            addResident(newName.trim());
            setNewName('');
        }
    };

    return (
        <>
            <PageTitle title="Residents Management" subtitle="Add, view, or remove hostel residents" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                   
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Add New Resident</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="residentName" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                                <Input
                                    id="residentName"
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g., John Doe"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Add Resident</Button>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Current Residents</h3>
                        
                       
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joining Date</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                {/* The animation ref is attached to the tbody */}
                                <tbody ref={animationParent} className="divide-y divide-slate-200">
                                    {residents.map(r => (
                                        <tr key={r.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{r.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(new Date(r.joinDate + 'T00:00:00'), 'dd MMMM, yyyy')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {/* This div centers the button within the cell */}
                                                <div className="flex items-center justify-center">
                                                   <Button
                                                      variant="danger"
                                                      onClick={() => deleteResident(r.id)}
                                                      className="h-8 w-8 !rounded-full !p-0 flex items-center justify-center"
                                             >
                                                    <TrashIcon className="h-4 w-4" />
                                                   </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};
// --- RECORDS PAGE ---
export const RecordsPage: React.FC = () => {
    const { residents, meals, market, updateMealRecord, addMarketRecord, deleteMarketRecord } = useData();
    const [activeTab, setActiveTab] = useState<'meals' | 'market'>('meals');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [marketResident, setMarketResident] = useState(residents[0]?.id || '');
    const [marketDate, setMarketDate] = useState(new Date().toISOString().split('T')[0]);
    const [marketAmount, setMarketAmount] = useState<number | ''>('');
    const [marketDesc, setMarketDesc] = useState('');
    const getResidentName = (id: string) => residents.find(r => r.id === id)?.name || 'Unknown';
    const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const { monthStart, monthEnd, monthDays } = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const daysInMonth = getDaysInMonth(currentMonth);
        const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return { monthStart, monthEnd, monthDays };
    }, [currentMonth]);
    const mealsForMonth = useMemo(() => {
        const mealMap = new Map<string, number>();
        meals.filter(m => isWithinInterval(new Date(m.date), { start: monthStart, end: monthEnd }))
             .forEach(m => {
                 const day = getDate(new Date(m.date));
                 mealMap.set(`${m.residentId}-${day}`, m.mealCount);
             });
        return mealMap;
    }, [meals, monthStart, monthEnd]);
    const handleMealChange = (residentId: string, day: number, value: string) => {
        const mealCount = parseInt(value, 10);
        const date = format(setDate(currentMonth, day), 'yyyy-MM-dd');
        updateMealRecord(residentId, date, isNaN(mealCount) ? 0 : mealCount);
    };
    const handleMarketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (marketResident && marketDate && Number(marketAmount) > 0 && marketDesc.trim()) {
            addMarketRecord({ residentId: marketResident, date: marketDate, amount: Number(marketAmount), description: marketDesc.trim() });
            setMarketAmount('');
            setMarketDesc('');
        }
    };
    const tabContentVariants = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } },
    };
    
    return (
        <>
            <PageTitle title="Log Records" subtitle="Manage monthly meals and market expenses" />
            <div className="mb-6 border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('meals')} className={`${activeTab === 'meals' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Meal Matrix</button>
                    <button onClick={() => setActiveTab('market')} className={`${activeTab === 'market' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Log Market Expense</button>
                </nav>
            </div>
            <AnimatePresence mode="wait">
                {activeTab === 'meals' && (
                    <motion.div
                        key="meals"
                        variants={tabContentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <Button onClick={goToPreviousMonth}>&lt; Prev</Button>
                                <h3 className="text-xl font-semibold text-slate-700">{format(currentMonth, 'MMMM yyyy')}</h3>
                                <Button onClick={goToNextMonth}>Next &gt;</Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white text-base">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-600 border-b-2 border-slate-200 min-w-[180px]">Resident</th>
                                            {monthDays.map(day => <th key={day} className="px-2 py-3 w-16 text-center font-semibold text-slate-600 border-b-2 border-slate-200">{day}</th>)}
                                            <th className="px-4 py-3 text-center font-semibold text-slate-600 border-b-2 border-slate-200 min-w-[100px]">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {residents.map(resident => {
                                            const rowTotal = monthDays.reduce((total, day) => total + (mealsForMonth.get(`${resident.id}-${day}`) || 0), 0);
                                            return (
                                                <tr key={resident.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/70 transition-colors h-16">
                                                    <td className="px-4 py-2 font-medium text-slate-800 whitespace-nowrap">{resident.name}</td>
                                                    {monthDays.map(day => (
                                                        <td key={day} className="p-1 min-w-[110px]">
                                                            <div className="flex flex-col items-center">
                                                              <Select value={String(mealsForMonth.get(`${resident.id}-${day}`) || 0)} onChange={e => handleMealChange(resident.id, day, e.target.value)} className="w-full h-14 text-center border-2 rounded-lg text-xl font-bold text-slate-700 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-primary-500" aria-label={`Meals for ${resident.name} on day ${day}`}>
                                                                {[0, 1, 2, 3, 4, 5].map(num => ( <option key={num} value={String(num)}>{num}</option>))}
                                                              </Select>
                                                              <span className="mt-1 text-base text-primary-700 font-semibold">{mealsForMonth.get(`${resident.id}-${day}`) ?? 0}</span>
                                                            </div>
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-2 text-center font-bold text-primary-700 bg-slate-100">{rowTotal}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="bg-slate-100 font-bold">
                                        <tr>
                                            <td className="px-4 py-3 font-semibold text-slate-800 border-t-2 border-slate-200">Grand Total</td>
                                            <td colSpan={monthDays.length} className="px-2 py-3 border-t-2 border-slate-200"></td>
                                            <td className="px-4 py-3 text-center text-primary-700 text-lg border-t-2 border-slate-200">{Array.from(mealsForMonth.values()).reduce((sum, count) => sum + count, 0)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'market' && (
                    <motion.div
                        key="market"
                        variants={tabContentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <Card>
                                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Log Market Expense</h3>
                                    <form onSubmit={handleMarketSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="marketResident" className="block text-sm font-medium text-slate-600 mb-1">Resident</label>
                                            <Select id="marketResident" value={marketResident} onChange={e => setMarketResident(e.target.value)} required>{residents.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</Select>
                                        </div>
                                        <div>
                                            <label htmlFor="marketDate" className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                                            <Input id="marketDate" type="date" value={marketDate} onChange={e => setMarketDate(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label htmlFor="marketAmount" className="block text-sm font-medium text-slate-600 mb-1">Amount (৳)</label>
                                            <Input id="marketAmount" type="number" value={marketAmount} onChange={e => setMarketAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 500" required min="1" />
                                        </div>
                                        <div>
                                            <label htmlFor="marketDesc" className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                            <Input id="marketDesc" type="text" value={marketDesc} onChange={e => setMarketDesc(e.target.value)} placeholder="e.g., Groceries" required />
                                        </div>
                                        <Button type="submit" className="w-full">Add Expense Record</Button>
                                    </form>
                                </Card>
                            </div>
                            <div className="lg:col-span-2">
    <Card>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Recent Market Entries</h3>
        
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resident</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {market.slice(0, 10).map(m => (
                        <tr key={m.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{getResidentName(m.residentId)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{format(new Date(m.date + 'T00:00:00'), 'dd MMMM, yyyy')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">৳{m.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 max-w-xs truncate" title={m.description}>{m.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center justify-center">
                                    <Button variant="danger" onClick={() => window.confirm('Are you sure you want to delete this market record?') && deleteMarketRecord(m.id)} className="h-8 w-8 !p-0 !rounded-full flex items-center justify-center">
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// --- REPORTS PAGE ---
export const ReportsPage: React.FC = () => {
    const { residents, meals, market } = useData();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM'));

    const {
        reportData,
        overallTotalMarket,
        mealRate,
    } = useMemo(() => {
        const year = getYear(new Date(selectedDate));
        const month = getMonth(new Date(selectedDate));
        const reportMonthStart = startOfMonth(new Date(year, month));
        const reportMonthEnd = endOfMonth(new Date(year, month));

        const filteredMeals = meals.filter(m => isWithinInterval(new Date(m.date), { start: reportMonthStart, end: reportMonthEnd }));
        const filteredMarket = market.filter(m => isWithinInterval(new Date(m.date), { start: reportMonthStart, end: reportMonthEnd }));
        
        const overallTotalMeals = filteredMeals.reduce((sum, meal) => sum + meal.mealCount, 0);
        const overallTotalMarket = filteredMarket.reduce((sum, item) => sum + item.amount, 0);
        
        const mealRate = overallTotalMeals > 0 ? overallTotalMarket / overallTotalMeals : 0;

        const data = residents.map(resident => {
            const residentMeals = filteredMeals.filter(m => m.residentId === resident.id);
            const residentMarket = filteredMarket.filter(m => m.residentId === resident.id);
            const totalMeals = residentMeals.reduce((sum, meal) => sum + meal.mealCount, 0);
            const totalMarket = residentMarket.reduce((sum, item) => sum + item.amount, 0);
            const mealCost = totalMeals * mealRate;
            const balance = totalMarket - mealCost;

            return { id: resident.id, name: resident.name, totalMarket, mealCost, balance };
        });

        return { reportData: data, overallTotalMarket, mealRate };
    }, [residents, meals, market, selectedDate]);

    const formatCurrency = (value: number) => {
        return `৳${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        const monthYear = format(new Date(selectedDate), 'MMMM yyyy');
        
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text(`Financial Report for ${monthYear}`, doc.internal.pageSize.getWidth() / 2, 22, { align: "center" });
        
        doc.setFontSize(11);
        doc.text(`Total Market Spend: ${formatCurrency(overallTotalMarket)}`, 14, 35);
        doc.text(`Calculated Meal Rate: ${formatCurrency(mealRate)}`, 14, 42);
        
        const head = [["Resident", "Market Spent", "Total Meal Cost", "Balance"]];
        const body = reportData.map(r => [
            r.name,
            formatCurrency(r.totalMarket),
            formatCurrency(r.mealCost),
            { content: `${formatCurrency(Math.abs(r.balance))} ${r.balance < 0 ? '(Owed)' : '(Return)'}`, styles: { textColor: r.balance < 0 ? [220, 38, 38] : [22, 101, 52] } }
        ]);
        
        autoTable(doc, { startY: 52, head, body, theme: "grid", headStyles: { fillColor: [29, 78, 216] }, columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } } });
        
        doc.save(`Financial-Report-${format(new Date(selectedDate), 'yyyy-MM')}.pdf`);
    };

    return (
        <>
            <PageTitle title="Monthly Reports" subtitle="Generate financial summary reports for any month" />
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                    <div>
                        <label htmlFor="reportMonth" className="block text-sm font-medium text-slate-600 mb-1">Select Month</label>
                        <Input id="reportMonth" type="month" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleDownloadPDF} className="w-full h-10 flex items-center justify-center">
                            <DownloadIcon className="h-5 w-5 mr-2" />
                            Download Report PDF
                        </Button>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-700 mb-4">Report for {format(new Date(selectedDate), 'MMMM yyyy')}</h3>
                <motion.div key={selectedDate} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resident</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Market Spent</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total Meal Cost</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {reportData.map(data => (
                                <tr key={data.id} className={data.balance < 0 ? 'bg-red-50' : 'bg-green-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{data.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{formatCurrency(data.totalMarket)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold text-right">{formatCurrency(data.mealCost)}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${data.balance < 0 ? 'text-red-600' : 'text-green-700'}`}>
                                        {formatCurrency(data.balance)}
                                        <span className="text-xs font-normal ml-1">{data.balance < 0 ? '(Owed)' : '(Return)'}</span>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-slate-100 font-bold">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">Total</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right">{formatCurrency(overallTotalMarket)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right">{formatCurrency(overallTotalMarket)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800"></td>
                            </tr>
                        </tbody>
                    </table>
                </motion.div>
            </Card>
        </>
    );
};

// --- CALCULATION PAGE ---


export const CalculationPage: React.FC = () => {

    const { residents, meals, market, bills, addBill, deleteBill } = useData();

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM'));
    const [fixedFee, setFixedFee] = useState<number | ''>('');

   

    const [newBillName, setNewBillName] = useState('');
    const [newBillAmount, setNewBillAmount] = useState<number | ''>('');
    const [newBillDate, setNewBillDate] = useState(new Date().toISOString().split('T')[0]);

    
    const handleAddBill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newBillName.trim() && Number(newBillAmount) > 0) {
            addBill({
                name: newBillName.trim(),
                amount: Number(newBillAmount),
                date: newBillDate, // Use the date from the input
            });
            setNewBillName('');
            setNewBillAmount('');
        }
    };

   
    const monthlyBills = useMemo(() => {
        const year = getYear(new Date(selectedDate));
        const month = getMonth(new Date(selectedDate));
        const monthStart = startOfMonth(new Date(year, month));
        const monthEnd = endOfMonth(new Date(year, month));
        
       
        return bills.filter(bill => isWithinInterval(new Date(bill.date), { start: monthStart, end: monthEnd }));
    }, [bills, selectedDate]); 
   
    const {
        calculationData,
        mealRate,
        overallTotalMeals,
        overallTotalMarket,
    } = useMemo(() => {
        const year = getYear(new Date(selectedDate));
        const month = getMonth(new Date(selectedDate));
        const reportMonthStart = startOfMonth(new Date(year, month));
        const reportMonthEnd = endOfMonth(new Date(year, month));
        const filteredMeals = meals.filter(m => isWithinInterval(new Date(m.date), { start: reportMonthStart, end: reportMonthEnd }));
        const filteredMarket = market.filter(m => isWithinInterval(new Date(m.date), { start: reportMonthStart, end: reportMonthEnd }));
        const numericFixedFee = Number(fixedFee) || 0;
        const overallTotalMeals = filteredMeals.reduce((sum, meal) => sum + meal.mealCount, 0);
        const overallTotalMarket = filteredMarket.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = overallTotalMarket + numericFixedFee;
        const mealRate = overallTotalMeals > 0 ? totalExpense / overallTotalMeals : 0;
        const residentCount = residents.length > 0 ? residents.length : 1;
        const individualFixedFeeShare = numericFixedFee / residentCount;
        const data = residents.map(resident => {
            const residentMeals = filteredMeals.filter(m => m.residentId === resident.id);
            const residentMarket = filteredMarket.filter(m => m.residentId === resident.id);
            const totalMeals = residentMeals.reduce((sum, meal) => sum + meal.mealCount, 0);
            const totalMarket = residentMarket.reduce((sum, item) => sum + item.amount, 0);
            const mealCost = totalMeals * mealRate;
            const totalDeposit = totalMarket + individualFixedFeeShare;
            const balance = totalDeposit - mealCost;
            return { id: resident.id, name: resident.name, totalMeals, totalMarket, mealCost, individualFixedFeeShare, totalDeposit, balance };
        });
        return { calculationData: data, mealRate, overallTotalMeals, overallTotalMarket };
    }, [residents, meals, market, selectedDate, fixedFee]);

    const formatCurrency = (value: number) => {
        return `৳${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <>
            <PageTitle title="Detailed Calculation" subtitle="A detailed breakdown of meal costs and balances for a selected month" />
            
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                     <div><label htmlFor="reportMonth" className="block text-sm font-medium text-slate-600 mb-1">Select Month</label><Input id="reportMonth" type="month" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /></div>
                     <div><label htmlFor="fixedFee" className="block text-sm font-medium text-slate-600 mb-1">Other Fixed Fees (৳)</label><Input id="fixedFee" type="number" value={fixedFee} onChange={(e) => setFixedFee(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., Cleaning staff" min="0" /></div>
                    <div className="flex items-end"><div className="p-3 bg-white shadow-sm rounded-lg w-full"><p className="text-sm text-slate-500 font-medium">Calculated Meal Rate</p><p className="text-2xl font-bold text-primary-600">{formatCurrency(mealRate)}</p></div></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Meal & Market Balance Sheet for {format(new Date(selectedDate), 'MMMM yyyy')}</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resident</th><th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Total Meals</th><th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Market Spent</th><th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Fixed Fee Share</th><th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total Deposit</th><th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Meal Cost</th><th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th></tr></thead><tbody className="divide-y divide-slate-200">{calculationData.map(data => (<tr key={data.id} className={data.balance < 0 ? 'bg-red-50' : 'bg-green-50'}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{data.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-center">{data.totalMeals}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{formatCurrency(data.totalMarket)}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right">{formatCurrency(data.individualFixedFeeShare)}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold text-right">{formatCurrency(data.totalDeposit)}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold text-right">{formatCurrency(data.mealCost)}</td><td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${data.balance < 0 ? 'text-red-600' : 'text-green-700'}`}>{formatCurrency(data.balance)}<span className="text-xs font-normal ml-1">{data.balance < 0 ? '(Owed)' : '(Return)'}</span></td></tr>))}<tr className="bg-slate-100 font-bold"><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">Total</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-center">{overallTotalMeals}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right">{formatCurrency(overallTotalMarket)}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right">{formatCurrency(Number(fixedFee) || 0)}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right">{formatCurrency(overallTotalMarket + (Number(fixedFee) || 0))}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right">{formatCurrency(overallTotalMarket + (Number(fixedFee) || 0))}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold text-right">{formatCurrency(0)}</td></tr></tbody></table>
                </div>
            </Card>

            <div className="mt-8">
                <Card>
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Bills & Rents for {format(new Date(selectedDate), 'MMMM yyyy')}</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                             <h4 className="text-md font-semibold text-slate-600 mb-3">Add New Bill</h4>
                            <form onSubmit={handleAddBill} className="space-y-4">
                                <div><label htmlFor="billName" className="block text-sm font-medium text-slate-600 mb-1">Bill Name</label><Input id="billName" type="text" value={newBillName} onChange={e => setNewBillName(e.target.value)} placeholder="e.g., Wifi, Electricity" required /></div>
                                <div><label htmlFor="billAmount" className="block text-sm font-medium text-slate-600 mb-1">Amount (৳)</label><Input id="billAmount" type="number" value={newBillAmount} onChange={e => setNewBillAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 1200" required min="1" /></div>
                                <div><label htmlFor="billDate" className="block text-sm font-medium text-slate-600 mb-1">Bill Date</label><Input id="billDate" type="date" value={newBillDate} onChange={e => setNewBillDate(e.target.value)} required /></div>
                                <Button type="submit" className="w-full">Add Bill</Button>
                            </form>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-slate-600 mb-3">Added Bills List</h4>
                            <div className="overflow-y-auto max-h-60 border rounded-lg">
                                 <table className="min-w-full">
                                    <thead className="bg-slate-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bill Name</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {/* MODIFIED: Map over `monthlyBills` and call `deleteBill` from context */}
                                        {monthlyBills.length > 0 ? monthlyBills.map(bill => (
                                            <tr key={bill.id}>
                                                <td className="px-4 py-2 text-sm text-slate-500 whitespace-nowrap">{format(new Date(bill.date + 'T00:00:00'), 'dd MMM, yyyy')}</td>
                                                <td className="px-4 py-2 text-sm font-medium text-slate-800">{bill.name}</td>
                                                <td className="px-4 py-2 text-sm text-slate-600 text-right">{formatCurrency(bill.amount)}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex justify-center">
                                                        <Button variant="danger" onClick={() => deleteBill(bill.id)} className="h-8 w-8 !p-0 !rounded-full flex items-center justify-center">
                                                            <TrashIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td className="p-4 text-center text-sm text-slate-500" colSpan={4}>No bills added for this month.</td></tr>
                                        )}
                                    </tbody>
                                    {monthlyBills.length > 0 && (
                                        <tfoot className="bg-slate-100 font-bold sticky bottom-0">
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-slate-800" colSpan={2}>Total</td>
                                                <td className="px-4 py-3 text-sm text-slate-800 text-right" colSpan={2}>{formatCurrency(monthlyBills.reduce((sum, b) => sum + b.amount, 0))}</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};