import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    monto: '',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
    forma_pago: '',
    aclaracion_pago: '',
    descripcion: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load expense data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchExpense = async () => {
        try {
          setLoading(true);
          const data = await api.getExpense(id);
          setFormData({
            monto: data.monto,
            categoria: data.categoria,
            fecha: data.fecha,
            forma_pago: data.forma_pago || '',
            aclaracion_pago: data.aclaracion_pago || '',
            descripcion: data.descripcion || ''
          });
          setLoading(false);
        } catch (err) {
          setError('Error al cargar los datos del gasto');
          setLoading(false);
          console.error(err);
        }
      };
      
      fetchExpense();
    }
  }, [id, isEditing]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoria: categoryId
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.monto || !formData.categoria || !formData.fecha) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditing) {
        await api.updateExpense(id, formData);
      } else {
        await api.createExpense(formData);
      }
      
      setLoading(false);
      navigate('/');
    } catch (err) {
      setError('Error al guardar el gasto');
      setLoading(false);
      console.error(err);
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar gasto' : 'Nuevo gasto'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <label htmlFor="monto" className="label">
            Monto <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="monto"
            name="monto"
            step="0.01"
            value={formData.monto}
            onChange={handleChange}
            className="input"
            required
            placeholder="0.00"
          />
        </div>
        
        {/* Category */}
        <div>
          <label className="label">
            Categoría <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {EXPENSE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`flex flex-col items-center p-3 rounded-lg border ${
                    formData.categoria === category.id
                      ? `${category.color} text-white border-transparent`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="text-xs mt-1">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Date */}
        <div>
          <label htmlFor="fecha" className="label">
            Fecha <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        
        {/* Payment method */}
        <div>
          <label htmlFor="forma_pago" className="label">
            Forma de pago
          </label>
          <select
            id="forma_pago"
            name="forma_pago"
            value={formData.forma_pago}
            onChange={handleChange}
            className="input"
          >
            <option value="">Seleccionar...</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Payment clarification (only if "Otro" is selected) */}
        {formData.forma_pago === 'otro' && (
          <div>
            <label htmlFor="aclaracion_pago" className="label">
              Aclaración de pago
            </label>
            <input
              type="text"
              id="aclaracion_pago"
              name="aclaracion_pago"
              value={formData.aclaracion_pago}
              onChange={handleChange}
              className="input"
              placeholder="Especifica la forma de pago"
            />
          </div>
        )}
        
        {/* Description */}
        <div>
          <label htmlFor="descripcion" className="label">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="input"
            rows="3"
            placeholder="Agrega una descripción (opcional)"
          ></textarea>
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm; 