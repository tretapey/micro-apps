import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ExpenseForm from './pages/ExpenseForm'
import ExpenseHistory from './pages/ExpenseHistory'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="new" element={<ExpenseForm />} />
        <Route path="edit/:id" element={<ExpenseForm />} />
        <Route path="history" element={<ExpenseHistory />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App 