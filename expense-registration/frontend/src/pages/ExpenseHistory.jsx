import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaEdit, FaTrash, FaDownload, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../services/api';
import { getCategoryById, getPaymentMethodById, formatCurrency, formatDate } from '../utils/constants';

const ExpenseHistory = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  
  // Current month and year
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Format month name
  const monthName = format(currentDate, 'MMMM yyyy', { locale: es });
  
  // Load expenses for current month
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await api.getExpensesByMonth(currentYear, currentMonth);
        setExpenses(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los gastos');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchExpenses();
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
  
  // Toggle expense details
  const toggleExpenseDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Handle expense deletion
  const handleDeleteExpense = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      try {
        await api.deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
      } catch (err) {
        setError('Error al eliminar el gasto');
        console.error(err);
      }
    }
  };
  
  // Handle CSV export
  const handleExportCSV = () => {
    api.exportExpensesCSV();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Historial de gastos</h1>
        <button 
          onClick={handleExportCSV}
          className="btn btn-secondary flex items-center"
        >
          <FaDownload className="mr-2" />
          Exportar CSV
        </button>
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
      
      {/* Expenses list */}
      <div className="card">
        {loading ? (
          <p className="text-center py-4">Cargando...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-4">{error}</p>
        ) : expenses.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No hay gastos registrados este mes</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {expenses.map((expense) => {
              const category = getCategoryById(expense.categoria);
              const Icon = category.icon;
              const paymentMethod = expense.forma_pago ? getPaymentMethodById(expense.forma_pago) : null;
              const isExpanded = expandedId === expense.id;
              
              return (
                <div key={expense.id} className="py-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpenseDetails(expense.id)}
                  >
                    <div className="flex items-center">
                      <div className={`${category.color} p-2 rounded-lg mr-3`}>
                        <Icon className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(expense.fecha)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-3">{formatCurrency(expense.monto)}</span>
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pl-12 space-y-3">
                      {paymentMethod && (
                        <div>
                          <span className="text-sm text-gray-500">Forma de pago:</span>
                          <p>{paymentMethod.name}</p>
                          {expense.aclaracion_pago && (
                            <p className="text-sm text-gray-600">{expense.aclaracion_pago}</p>
                          )}
                        </div>
                      )}
                      
                      {expense.descripcion && (
                        <div>
                          <span className="text-sm text-gray-500">Descripción:</span>
                          <p>{expense.descripcion}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 pt-2">
                        <Link 
                          to={`/edit/${expense.id}`}
                          className="btn btn-secondary flex items-center py-1 px-3"
                        >
                          <FaEdit className="mr-1" />
                          Editar
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExpense(expense.id);
                          }}
                          className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 flex items-center py-1 px-3"
                        >
                          <FaTrash className="mr-1" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory; 