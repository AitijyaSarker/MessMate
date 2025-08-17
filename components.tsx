
import React from 'react';
import type { Resident } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- ICONS (Heroicons) ---
export const DashboardIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);
export const UsersIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.684A3.75 3.75 0 0015 19.128zM12 12.75a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z" />
  </svg>
);
export const ClipboardIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
export const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);
export const LogoIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3-1m-3-1l-3 1m3-1V7.5M6.75 7.5l-3 1m0 0l-3-1m3 1v1.5m13.5-2.5l-3-1m-3-1l-3 1m3-1V4.5m3 1.5l3-1.091" />
  </svg>
);
export const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);


export const CalculatorIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5v10.5a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V9.75z" />
    </svg>
);


export const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);



// --- UI COMPONENTS ---
export const PageTitle: React.FC<{title: string, subtitle: string}> = ({title, subtitle}) => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-500 mt-1">{subtitle}</p>
    </div>
);

export const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

// --- Google ICON ---


export const GoogleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path
                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -7.024 60.329 C -4.624 58.159 -3.264 55.159 -3.264 51.509 Z"
                fill="#4285f4"
            />
            <path
                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -7.024 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.244 53.529 L -25.244 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                fill="#34a853"
            />
            <path
                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.244 45.859 C -26.284 47.979 -26.754 50.259 -26.754 52.739 C -26.754 55.219 -26.284 57.499 -25.244 59.619 L -21.484 53.529 Z"
                fill="#fbbc05"
            />
            <path
                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.244 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                fill="#ea4335"
            />
        </g>
    </svg>
);


export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary' | 'danger'}> = ({ children, className, variant='primary', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    }
    return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input className={`block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${className}`} {...props} />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className, ...props }) => (
  <select className={`block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${className}`} {...props}>
    {children}
  </select>
);

export const Table: React.FC<{headers: string[], children: React.ReactNode}> = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
        <thead className="bg-slate-50">
            <tr>
                {headers.map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>)}
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
            {children}
        </tbody>
    </table>
  </div>
);

// --- DASHBOARD COMPONENTS ---
export const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode}> = ({ title, value, icon }) => (
  <Card className="flex items-center">
    <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </Card>
);

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent } : any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


// --- CHART COMPONENTS ---
export const MonthlyMealChart: React.FC<{data: any[]}> = ({data}) => (
    <Card>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Monthly Meals per Resident</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}}/>
                <Legend />
                <Bar dataKey="meals" fill="#3b82f6" name="Total Meals" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </Card>
);

export const MarketExpenseChart: React.FC<{data: any[]}> = ({data}) => (
    <Card>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Market Expenses by Resident</h3>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" labelLine={false} label={renderCustomizedLabel}>
                   {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}}/>
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </Card>
);