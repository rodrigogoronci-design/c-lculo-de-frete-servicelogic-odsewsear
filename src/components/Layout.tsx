import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
