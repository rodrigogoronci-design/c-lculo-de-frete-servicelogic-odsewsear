import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  calcularTarifaBase,
  calcularDiesel,
  calcularPedagio,
  createCalculo,
  getRotas,
} from '@/services/api'
import { vehicles } from '@/lib/data'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { CalculationResults } from '@/components/CalculationResults'
import { Loader2, Calculator } from 'lucide-react'

export function FreightCalculator({
  preselectedRoute,
  initialRouteId,
  onCalculate,
}: {
  preselectedRoute?: any
  initialRouteId?: string
  onCalculate?: () => void
}) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [routes, setRoutes] = useState<any[]>([])
  const [routeId, setRouteId] = useState<string>(preselectedRoute?.id || initialRouteId || '')
  const [vehicle, setVehicle] = useState('LS_6_EIXOS')
  const [weight, setWeight] = useState('1000')
  const [volume, setVolume] = useState('10')
  const [calcDate, setCalcDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    if (!preselectedRoute) {
      getRotas()
        .then((data) => {
          setRoutes(data)
          if (initialRouteId && data.some((r) => r.id === initialRouteId)) {
            setRouteId(initialRouteId)
          }
        })
        .catch(console.error)
    }
  }, [preselectedRoute, initialRouteId])

  const handleCalculate = async () => {
    const selectedRoute = preselectedRoute || routes.find((r) => r.id === routeId)
    if (!selectedRoute) return

    setIsCalculating(true)
    setResult(null)
    try {
      const tarifaRes = await calcularTarifaBase({
        rota_id: selectedRoute.id,
        tipo_veiculo: vehicle,
        peso_kg: Number(weight),
        volume_m3: Number(volume),
      })

      const dieselRes = await calcularDiesel({
        rota_id: selectedRoute.id,
        valor_tarifa_base: tarifaRes.valor_tarifa_base,
        data_calculo: calcDate,
      })

      const pedagioRes = await calcularPedagio({
        rota_id: selectedRoute.id,
        tipo_veiculo: vehicle,
      })

      const tollValue = pedagioRes.valor_pedagio
      const dieselValue = dieselRes.valor_diesel

      const finalTotal =
        tarifaRes.valor_total -
        tarifaRes.valor_diesel -
        tarifaRes.valor_pedagio +
        dieselValue +
        tollValue

      const calcResult = {
        route: {
          id: selectedRoute.id,
          name: selectedRoute.destino || selectedRoute.name,
          uf: selectedRoute.uf,
          region: selectedRoute.regiao || selectedRoute.region,
          distanceKm: selectedRoute.km || selectedRoute.distanceKm,
        },
        vehicle: vehicles.find((v) => v.id === vehicle) || vehicles[0],
        baseFreight: tarifaRes.valor_tarifa_base,
        dieselCost: dieselValue,
        toll: tollValue,
        total: finalTotal,
        ratePerKm: tarifaRes.valor_tarifa_por_km,
        validity: tarifaRes.data_vigencia,
      }

      setResult(calcResult)

      await createCalculo({
        usuario_id: user?.id,
        rota_id: selectedRoute.id,
        tipo_veiculo: vehicle,
        peso_kg: Number(weight),
        volume_m3: Number(volume),
        valor_tarifa_base: tarifaRes.valor_tarifa_base,
        valor_diesel: dieselValue,
        valor_pedagio: tollValue,
        valor_total: finalTotal,
        data_calculo: new Date(calcDate + 'T12:00:00Z').toISOString(),
      })

      toast({ title: 'Sucesso', description: 'Cálculo realizado e salvo com sucesso.' })
      if (onCalculate) onCalculate()
    } catch (err: any) {
      toast({
        title: 'Erro no cálculo',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border shadow-sm">
        {!preselectedRoute && (
          <div className="space-y-2 lg:col-span-2">
            <Label className="text-slate-700 font-semibold">Rota</Label>
            <Select value={routeId} onValueChange={setRouteId}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione uma rota" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.destino} - {r.uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className={`space-y-2 ${preselectedRoute ? 'lg:col-span-1' : ''}`}>
          <Label className="text-slate-700 font-semibold">Veículo</Label>
          <Select value={vehicle} onValueChange={setVehicle}>
            <SelectTrigger className="bg-white">
              <SelectValue />
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
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Data do Cálculo</Label>
          <Input
            type="date"
            value={calcDate}
            onChange={(e) => setCalcDate(e.target.value)}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Peso (kg)</Label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0"
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold">Volume (m³)</Label>
          <Input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            min="0"
            className="bg-white"
          />
        </div>
        <div
          className={`md:col-span-2 ${!preselectedRoute ? 'lg:col-span-4' : 'lg:col-span-2'} flex items-end`}
        >
          <Button
            onClick={handleCalculate}
            disabled={isCalculating || (!preselectedRoute && !routeId)}
            className="w-full bg-brand-blue hover:bg-blue-900 text-white h-10 shadow-md"
          >
            {isCalculating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Calculator className="mr-2 h-4 w-4" />
            )}
            Calcular Frete
          </Button>
        </div>
      </div>

      {result && <CalculationResults {...result} />}
    </div>
  )
}
