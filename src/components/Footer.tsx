export function Footer() {
  return (
    <footer className="border-t bg-slate-100 py-8 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} ServiceLogic - Logística Inteligente. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  )
}
