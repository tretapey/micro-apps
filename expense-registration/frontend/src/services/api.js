import axios from 'axios';

const API_URL = '/api';

const api = {
  // Get all expenses
  getExpenses: async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },
  
  // Get expenses for a specific month
  getExpensesByMonth: async (year, month) => {
    try {
      const response = await axios.get(`${API_URL}/expenses/month/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses by month:', error);
      throw error;
    }
  },
  
  // Get expense summary by category for a specific month
  getExpenseSummary: async (year, month) => {
    try {
      const response = await axios.get(`${API_URL}/expenses/summary/month/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense summary:', error);
      throw error;
    }
  },
  
  // Get a single expense by ID
  getExpense: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching expense with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new expense
  createExpense: async (expenseData) => {
    try {
      const response = await axios.post(`${API_URL}/expenses`, expenseData);
      return response.data;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },
  
  // Update an existing expense
  updateExpense: async (id, expenseData) => {
    try {
      const response = await axios.put(`${API_URL}/expenses/${id}`, expenseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating expense with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete an expense
  deleteExpense: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting expense with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Export expenses as CSV
  exportExpensesCSV: () => {
    window.open(`${API_URL}/expenses/export/csv`, '_blank');
  }
};

export default api; 