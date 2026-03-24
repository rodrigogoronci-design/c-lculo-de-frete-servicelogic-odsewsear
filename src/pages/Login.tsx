import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Truck, LogIn } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await signIn(email, password)
    setIsLoading(false)

    if (error) {
      toast({
        title: 'Erro de Autenticação',
        description: 'Credenciais inválidas. Verifique seu email e senha.',
        variant: 'destructive',
      })
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md shadow-elevation border-0 bg-white">
        <CardHeader className="space-y-3 text-center pb-8 pt-10">
          <div className="flex justify-center mb-2 animate-fade-in-up">
            <div className="bg-brand-blue/10 p-4 rounded-full">
              <Truck className="h-10 w-10 text-brand-orange" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-brand-blue tracking-tight">
            ServiceLogic
          </CardTitle>
          <CardDescription className="text-base">
            Faça login para acessar o sistema de fretes
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-brand-orange hover:bg-[#e67e00] text-white text-base font-semibold shadow-md transition-all"
            >
              {isLoading ? (
                'Entrando...'
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" /> Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
