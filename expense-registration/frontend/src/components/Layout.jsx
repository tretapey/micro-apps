import { Outlet, Link, useLocation } from 'react-router-dom'
import { FaHome, FaHistory, FaPlus } from 'react-icons/fa'

const Layout = () => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-primary-600 font-bold text-xl">
                Registrador de Gastos
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      
      <nav className="bg-white shadow-lg fixed bottom-0 w-full border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-around">
            <Link 
              to="/" 
              className={`flex flex-col items-center py-3 px-6 ${
                location.pathname === '/' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
              }`}
            >
              <FaHome className="text-xl" />
              <span className="text-xs mt-1">Inicio</span>
            </Link>
            
            <Link 
              to="/new" 
              className="flex flex-col items-center py-3 px-6 text-white bg-primary-600 rounded-t-lg -mt-5 shadow-lg"
            >
              <FaPlus className="text-xl" />
              <span className="text-xs mt-1">Nuevo</span>
            </Link>
            
            <Link 
              to="/history" 
              className={`flex flex-col items-center py-3 px-6 ${
                location.pathname === '/history' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
              }`}
            >
              <FaHistory className="text-xl" />
              <span className="text-xs mt-1">Historial</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from being hidden behind the fixed navbar */}
      <div className="h-16"></div>
    </div>
  )
}

export default Layout 