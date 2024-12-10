import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Layout({ children }) {
    const { user, logout } = useAuth()
    
    return (
      <div className="min-h-screen w-full flex flex-col bg-gray-550">
        <nav className="w-full bg-gray-450 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center px-2 py-2 text-gray-100">
                  Polls
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin/polls/new"
                    className="ml-4 flex items-center px-2 py-2 text-gray-100"
                  >
                    Create Poll
                  </Link>
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-4 text-gray-100">{user?.email}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-md text-red-600 font-bold hover:text-red-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    )
  }