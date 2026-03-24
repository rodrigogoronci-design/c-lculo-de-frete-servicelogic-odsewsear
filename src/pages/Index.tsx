import { useSearchParams } from 'react-router-dom'
import { FreightCalculator } from '@/components/FreightCalculator'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Truck } from 'lucide-react'

export default function Index() {
  const [searchParams] = useSearchParams()
  const destination = searchParams.get('destination')

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black text-brand-blue tracking-tight">Calculadora de Frete</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Simule rapidamente os custos de transporte, incluindo tarifas base, variações de diesel
          por data e pedágios.
        </p>
      </div>

      <Card className="shadow-elevation border-0 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b pb-6">
          <CardTitle className="flex items-center gap-2 text-xl text-brand-blue">
            <Truck className="h-6 w-6 text-brand-orange" />
            Nova Simulação
          </CardTitle>
          <CardDescription className="text-sm">
            Selecione a rota, informe os detalhes da carga e a data para aplicar a regra do diesel
            vigente.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <FreightCalculator initialRouteId={destination || undefined} />
        </CardContent>
      </Card>
    </div>
  )
}
