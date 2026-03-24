import { useState, useEffect } from 'react'
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
import { vehicles, RouteData, VehicleType } from '@/lib/data'
import { CalculationResults } from '@/components/CalculationResults'
import { getRotas, getTarifas, createCalculo } from '@/services/api'
import { useAuth } from '@/hooks/use-auth'

export default function Index() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()

  const [rotas, setRotas] = useState<any[]>([])
  const [destinationId, setDestinationId] = useState<string>(searchParams.get('destination') || '')
  const [vehicleId, setVehicleId] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [volume, setVolume] = useState<string>('')
  const [isCalculating, setIsCalculating] = useState(false)

  const [result, setResult] = useState<{
    route: RouteData
    vehicle: VehicleType
    baseFreight: number
    dieselCost: number
    toll: number
    total: number
  } | null>(null)

  useEffect(() => {
    getRotas().then(setRotas).catch(console.error)
  }, [])

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destinationId || !vehicleId || !weight || !volume) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    const route = rotas.find((d) => d.id === destinationId)
    const vehicle = vehicles.find((v) => v.id === vehicleId)

    if (route && vehicle) {
      setIsCalculating(true)
      try {
        const tarifas = await getTarifas(route.id)
        const tarifa = tarifas.find((t) => t.tipo_veiculo === vehicle.id)

        const tarifaPorKm = tarifa ? tarifa.valor_tarifa_km : 6.5 * vehicle.multiplier

        const baseFreight = route.km * tarifaPorKm
        const dieselCost = route.km * 1.5
        const weightBonus = parseFloat(weight) * 0.1
        const volumeBonus = parseFloat(volume) * 2
        const toll = (route.km / 100) * 20
        const total = baseFreight + dieselCost + toll + weightBonus + volumeBonus

        await createCalculo({
          usuario_id: user?.id,
          rota_id: route.id,
          tipo_veiculo: vehicle.id,
          peso_kg: parseFloat(weight),
          volume_m3: parseFloat(volume),
          valor_tarifa_base: baseFreight,
          valor_diesel: dieselCost,
          valor_pedagio: toll,
          valor_total: total,
          data_calculo: new Date().toISOString(),
        })

        setResult({
          route: {
            id: route.id,
            name: route.destino,
            uf: route.uf,
            region: route.regiao,
            distanceKm: route.km,
          },
          vehicle,
          baseFreight,
          dieselCost,
          toll,
          total,
        })
        toast({ title: 'Cálculo Concluído', description: 'O frete foi calculado e registrado.' })
      } catch (error) {
        console.error(error)
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao calcular o frete.',
          variant: 'destructive',
        })
      } finally {
        setIsCalculating(false)
      }
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
                    {rotas.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.destino} - {d.uf}
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
                    step="0.01"
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
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-brand-orange hover:bg-[#e67e00] text-white font-semibold py-6 text-lg transition-all hover:scale-[1.02] shadow-md"
              >
                {isCalculating ? 'Calculando...' : 'Calcular Frete'}
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
