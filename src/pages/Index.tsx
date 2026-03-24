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
import { getRotas, createCalculo, calcularTarifaBase } from '@/services/api'
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
    ratePerKm?: number
    validity?: string
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

    setIsCalculating(true)
    try {
      // Usa o novo endpoint no backend para o cálculo exato
      const response = await calcularTarifaBase({
        rota_id: destinationId,
        tipo_veiculo: vehicleId,
        peso_kg: parseFloat(weight),
        volume_m3: parseFloat(volume),
      })

      const vehicle = vehicles.find((v) => v.id === vehicleId)

      // Registra no histórico com os valores processados pelo backend
      await createCalculo({
        usuario_id: user?.id,
        rota_id: destinationId,
        tipo_veiculo: vehicleId,
        peso_kg: parseFloat(weight),
        volume_m3: parseFloat(volume),
        valor_tarifa_base: response.valor_tarifa_base,
        valor_diesel: response.valor_diesel,
        valor_pedagio: response.valor_pedagio,
        valor_total: response.valor_total,
        data_calculo: new Date().toISOString(),
      })

      setResult({
        route: {
          id: response.rota.id,
          name: response.rota.destino,
          uf: response.rota.uf,
          region: response.rota.regiao,
          distanceKm: response.km,
        },
        vehicle: vehicle || { id: vehicleId, name: vehicleId, multiplier: 1 },
        baseFreight: response.valor_tarifa_base,
        dieselCost: response.valor_diesel,
        toll: response.valor_pedagio,
        total: response.valor_total,
        ratePerKm: response.valor_tarifa_por_km,
        validity: response.data_vigencia,
      })

      toast({
        title: 'Cálculo Concluído',
        description: 'O frete foi calculado com sucesso pelo servidor.',
      })
    } catch (error: any) {
      console.error(error)
      const errorMessage =
        error?.response?.message || error?.message || 'Ocorreu um erro ao calcular o frete.'
      toast({
        title: 'Erro no Cálculo',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsCalculating(false)
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
                {isCalculating ? 'Processando no Servidor...' : 'Calcular Frete'}
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
                Preencha o formulário e clique em calcular para processar os valores no servidor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
