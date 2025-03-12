const express = require('express');
const { db } = require('../database');

const router = express.Router();

// Get all expenses
router.get('/', (req, res) => {
  try {
    const query = `SELECT * FROM gastos ORDER BY fecha DESC`;
    const rows = db.prepare(query).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get expenses by month
router.get('/month/:year/:month', (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    
    // Calculate end date (first day of next month)
    const nextMonth = month === '12' ? '01' : String(Number(month) + 1).padStart(2, '0');
    const nextYear = month === '12' ? String(Number(year) + 1) : year;
    const endDate = `${nextYear}-${nextMonth}-01`;
    
    const query = `SELECT * FROM gastos WHERE fecha >= ? AND fecha < ? ORDER BY fecha DESC`;
    const rows = db.prepare(query).all(startDate, endDate);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get expenses by category for current month
router.get('/summary/month/:year/:month', (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    
    // Calculate end date (first day of next month)
    const nextMonth = month === '12' ? '01' : String(Number(month) + 1).padStart(2, '0');
    const nextYear = month === '12' ? String(Number(year) + 1) : year;
    const endDate = `${nextYear}-${nextMonth}-01`;
    
    const query = `
      SELECT categoria, SUM(monto) as total
      FROM gastos 
      WHERE fecha >= ? AND fecha < ?
      GROUP BY categoria
      ORDER BY total DESC
    `;
    
    const rows = db.prepare(query).all(startDate, endDate);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single expense
router.get('/:id', (req, res) => {
  try {
    const query = `SELECT * FROM gastos WHERE id = ?`;
    const row = db.prepare(query).get(req.params.id);
    
    if (!row) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new expense
router.post('/', (req, res) => {
  try {
    const { monto, categoria, fecha, forma_pago, aclaracion_pago, descripcion } = req.body;
    
    if (!monto || !categoria || !fecha) {
      return res.status(400).json({ error: 'Monto, categoría y fecha son campos obligatorios' });
    }
    
    const query = `
      INSERT INTO gastos (monto, categoria, fecha, forma_pago, aclaracion_pago, descripcion)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = db.prepare(query).run(monto, categoria, fecha, forma_pago, aclaracion_pago, descripcion);
    
    res.status(201).json({
      id: result.lastInsertRowid,
      monto,
      categoria,
      fecha,
      forma_pago,
      aclaracion_pago,
      descripcion
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an expense
router.put('/:id', (req, res) => {
  try {
    const { monto, categoria, fecha, forma_pago, aclaracion_pago, descripcion } = req.body;
    
    if (!monto || !categoria || !fecha) {
      return res.status(400).json({ error: 'Monto, categoría y fecha son campos obligatorios' });
    }
    
    const query = `
      UPDATE gastos
      SET monto = ?, categoria = ?, fecha = ?, forma_pago = ?, aclaracion_pago = ?, descripcion = ?
      WHERE id = ?
    `;
    
    const result = db.prepare(query).run(monto, categoria, fecha, forma_pago, aclaracion_pago, descripcion, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    
    res.json({
      id: req.params.id,
      monto,
      categoria,
      fecha,
      forma_pago,
      aclaracion_pago,
      descripcion
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense
router.delete('/:id', (req, res) => {
  try {
    const query = `DELETE FROM gastos WHERE id = ?`;
    const result = db.prepare(query).run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    
    res.json({ message: 'Gasto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export expenses as CSV
router.get('/export/csv', (req, res) => {
  try {
    const query = `SELECT * FROM gastos ORDER BY fecha DESC`;
    const rows = db.prepare(query).all();
    
    // Create CSV header
    let csv = 'id,monto,categoria,fecha,forma_pago,aclaracion_pago,descripcion\n';
    
    // Add rows to CSV
    rows.forEach(row => {
      csv += `${row.id},${row.monto},"${row.categoria}","${row.fecha}","${row.forma_pago || ''}","${row.aclaracion_pago || ''}","${row.descripcion || ''}"\n`;
    });
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=gastos.csv');
    
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 