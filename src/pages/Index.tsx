import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calculator } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { destinations, vehicles, RouteData, VehicleType } from '@/lib/data'
import { CalculationResults } from '@/components/CalculationResults'

export default function Index() {
  const [searchParams] = useSearchParams()
  const { toast } = useToast()

  const [destinationId, setDestinationId] = useState<string>(searchParams.get('destination') || '')
  const [vehicleId, setVehicleId] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [volume, setVolume] = useState<string>('')

  const [result, setResult] = useState<{
    route: RouteData
    vehicle: VehicleType
    baseFreight: number
    dieselCost: number
    toll: number
    total: number
  } | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destinationId || !vehicleId || !weight || !volume) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    const route = destinations.find((d) => d.id === destinationId)
    const vehicle = vehicles.find((v) => v.id === vehicleId)

    if (route && vehicle) {
      const baseFreight = route.adjustedRate * vehicle.multiplier
      const dieselCost = route.distanceKm * 1.5
      const weightBonus = parseFloat(weight) * 0.1
      const volumeBonus = parseFloat(volume) * 2
      const total = baseFreight + dieselCost + route.toll + weightBonus + volumeBonus

      setResult({ route, vehicle, baseFreight, dieselCost, toll: route.toll, total })
      toast({ title: 'Cálculo Concluído', description: 'O frete foi calculado com sucesso.' })
    }
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-brand-blue tracking-tight">
          Cálculo de Frete Instantâneo
        </h1>
        <p className="text-lg text-slate-600">
          Obtenha estimativas precisas para suas rotas logísticas baseadas no seu veículo e carga.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-4 shadow-elevation border-0 bg-white">
          <CardHeader className="bg-slate-50/50 rounded-t-xl border-b pb-6">
            <CardTitle className="flex items-center gap-2 text-xl text-brand-blue">
              <Calculator className="h-5 w-5 text-brand-orange" />
              Parâmetros da Carga
            </CardTitle>
            <CardDescription>Preencha os dados para calcular o valor do frete</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Select value={destinationId} onValueChange={setDestinationId}>
                  <SelectTrigger id="destination" className="w-full">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} - {d.uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Tipo de Veículo</Label>
                <Select value={vehicleId} onValueChange={setVehicleId}>
                  <SelectTrigger id="vehicle" className="w-full">
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume (m³)</Label>
                  <Input
                    id="volume"
                    type="number"
                    min="0"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-orange hover:bg-[#e67e00] text-white font-semibold py-6 text-lg transition-all hover:scale-[1.02] shadow-md"
              >
                Calcular Frete
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-8">
          {result ? (
            <CalculationResults {...result} />
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm p-8 text-center">
              <Calculator className="h-16 w-16 mb-4 opacity-20 text-brand-blue" />
              <p className="text-lg font-medium text-slate-500">Aguardando dados da carga</p>
              <p className="text-sm mt-2">
                Preencha o formulário e clique em calcular para visualizar os resultados detalhados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
