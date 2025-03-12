import { 
  FaUtensils, 
  FaShoppingCart, 
  FaHome, 
  FaCar, 
  FaPlane, 
  FaMedkit, 
  FaGraduationCap, 
  FaGamepad, 
  FaTshirt, 
  FaWifi 
} from 'react-icons/fa';

// Categorías de gastos con sus íconos
export const EXPENSE_CATEGORIES = [
  { id: 'comida', name: 'Comida', icon: FaUtensils, color: 'bg-red-500' },
  { id: 'supermercado', name: 'Supermercado', icon: FaShoppingCart, color: 'bg-blue-500' },
  { id: 'hogar', name: 'Hogar', icon: FaHome, color: 'bg-green-500' },
  { id: 'transporte', name: 'Transporte', icon: FaCar, color: 'bg-yellow-500' },
  { id: 'viajes', name: 'Viajes', icon: FaPlane, color: 'bg-purple-500' },
  { id: 'salud', name: 'Salud', icon: FaMedkit, color: 'bg-pink-500' },
  { id: 'educacion', name: 'Educación', icon: FaGraduationCap, color: 'bg-indigo-500' },
  { id: 'entretenimiento', name: 'Entretenimiento', icon: FaGamepad, color: 'bg-orange-500' },
  { id: 'ropa', name: 'Ropa', icon: FaTshirt, color: 'bg-teal-500' },
  { id: 'servicios', name: 'Servicios', icon: FaWifi, color: 'bg-gray-500' },
];

// Formas de pago
export const PAYMENT_METHODS = [
  { id: 'efectivo', name: 'Efectivo' },
  { id: 'transferencia', name: 'Transferencia' },
  { id: 'tarjeta', name: 'Tarjeta' },
  { id: 'otro', name: 'Otro' },
];

// Función para obtener una categoría por su ID
export const getCategoryById = (categoryId) => {
  return EXPENSE_CATEGORIES.find(category => category.id === categoryId) || {
    id: categoryId,
    name: categoryId,
    icon: FaShoppingCart,
    color: 'bg-gray-500'
  };
};

// Función para obtener un método de pago por su ID
export const getPaymentMethodById = (methodId) => {
  return PAYMENT_METHODS.find(method => method.id === methodId) || {
    id: methodId,
    name: methodId
  };
};

// Formato de fecha para mostrar en la UI
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Formato de moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}; 