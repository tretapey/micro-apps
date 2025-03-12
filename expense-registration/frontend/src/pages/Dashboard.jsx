import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../services/api';
import { EXPENSE_CATEGORIES, getCategoryById, formatCurrency } from '../utils/constants';

const Dashboard = () => {
  const [summary, setSummary] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Current month and year
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Format month name
  const monthName = format(currentDate, 'MMMM yyyy', { locale: es });
  
  // Load expense summary for current month
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await api.getExpenseSummary(currentYear, currentMonth);
        setSummary(data);
        
        // Calculate total
        const total = data.reduce((acc, item) => acc + item.total, 0);
        setTotalAmount(total);
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el resumen de gastos');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchSummary();
  }, [currentMonth, currentYear]);
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      {/* Month selector */}
      <div className="flex justify-between items-center">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          &lt;
        </button>
        <h2 className="text-xl font-medium text-gray-700 capitalize">
          {monthName}
        </h2>
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-200"
          disabled={
            currentDate.getMonth() === new Date().getMonth() && 
            currentDate.getFullYear() === new Date().getFullYear()
          }
        >
          &gt;
        </button>
      </div>
      
      {/* Total amount */}
      <div className="card bg-primary-600 text-white">
        <h3 className="text-lg font-medium">Total de gastos</h3>
        <p className="text-3xl font-bold mt-2">
          {formatCurrency(totalAmount)}
        </p>
      </div>
      
      {/* Category summary */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Gastos por categoría</h3>
        
        {loading ? (
          <p className="text-center py-4">Cargando...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-4">{error}</p>
        ) : summary.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No hay gastos registrados este mes</p>
            <Link to="/new" className="btn btn-primary">
              Registrar nuevo gasto
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {summary.map((item) => {
              const category = getCategoryById(item.categoria);
              const Icon = category.icon;
              
              return (
                <div key={item.categoria} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`${category.color} p-2 rounded-lg mr-3`}>
                      <Icon className="text-white" />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Quick add button (for mobile) */}
      <div className="md:hidden fixed bottom-24 right-6">
        <Link 
          to="/new" 
          className="flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg"
        >
          +
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 