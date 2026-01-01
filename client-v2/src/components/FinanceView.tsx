import { useState } from 'react'; // <--- Import useState
import { useFinance } from '../hooks/useFinance';
import { AddContributionModal } from './AddContributionModal'; // <--- Import Modal
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const FinanceView = () => {
  const { transactions, isLoading, addTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- State for Modal

  // Calculate Totals
  const totalOffering = transactions
    .filter(t => t.category === 'Offering')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWelfare = transactions
    .filter(t => t.category === 'Welfare Dues')
    .reduce((sum, t) => sum + t.amount, 0);

  const chartData = transactions.slice(0, 5).reverse().map(t => ({
    name: t.date,
    amount: t.amount
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
        
        {/* BUTTON TO OPEN MODAL */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-colors"
        >
          <span>+</span> Record Transaction
        </button>
      </div>

      {/* RENDER MODAL */}
      <AddContributionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          await addTransaction(data);
          // Auto-refresh is handled inside the hook
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-bold uppercase">Total Offering</p>
          <p className="text-3xl font-bold text-green-600 mt-2">GHS {totalOffering.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-bold uppercase">Welfare Dues</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">GHS {totalWelfare.toFixed(2)}</p>
        </div>
        <div className="bg-purple-600 p-6 rounded-xl shadow-sm text-white">
          <p className="text-sm font-bold uppercase opacity-80">System Balance</p>
          <p className="text-3xl font-bold mt-2">GHS {(totalOffering + totalWelfare).toFixed(2)}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Recent Inflow Trends</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 font-bold text-slate-700">Recent Transactions</div>
        {isLoading ? <div className="p-8 text-center">Loading...</div> : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Member / Source</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-500">{t.date}</td>
                  
                  {/* LOGIC: Show Name if exists, else "General Congregation" */}
                  <td className="p-4 font-medium">
                    {t.first_name 
                      ? `${t.first_name} ${t.surname}` 
                      : <span className="text-slate-400 italic">General Congregation</span>
                    }
                    <div className="text-xs text-slate-400 font-normal">{t.notes}</div>
                  </td>

                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      t.category === 'Offering' ? 'bg-green-100 text-green-700' :
                      t.category === 'Pledge' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{t.category}</span>
                  </td>
                  <td className="p-4 text-right font-bold text-slate-700">GHS {t.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};