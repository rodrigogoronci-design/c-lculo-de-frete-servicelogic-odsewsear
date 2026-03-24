import { Link, useLocation } from 'react-router-dom'
import { Truck, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

export function Header() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const navLinks = [
    { name: 'Cálculo de Frete', path: '/' },
    { name: 'Tabela de Rotas', path: '/rotas' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-brand-blue hover:opacity-90 transition-opacity"
        >
          <Truck className="h-6 w-6 text-brand-orange" />
          <span className="font-sans font-bold text-xl tracking-tight">ServiceLogic</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-all',
                  location.pathname === link.path
                    ? 'text-brand-orange border-b-2 border-brand-orange py-1'
                    : 'text-slate-600 hover:text-brand-orange',
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          {user && (
            <button
              onClick={signOut}
              className="text-sm font-medium text-slate-500 hover:text-red-500 flex items-center gap-1.5 transition-colors ml-4"
            >
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sair</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
