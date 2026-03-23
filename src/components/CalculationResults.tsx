import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RouteData, VehicleType } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { MapPin, Route, Wallet, Fuel, Banknote, Map } from 'lucide-react'

interface CalculationResultProps {
  route: RouteData
  vehicle: VehicleType
  baseFreight: number
  dieselCost: number
  toll: number
  total: number
}

export function CalculationResults({
  route,
  vehicle,
  baseFreight,
  dieselCost,
  toll,
  total,
}: CalculationResultProps) {
  return (
    <div className="space-y-6 animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-brand-blue shadow-elevation bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Tarifa Base</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(baseFreight)}</p>
              </div>
              <Wallet className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-elevation bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Valor do Diesel</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(dieselCost)}</p>
              </div>
              <Fuel className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-slate-400 shadow-elevation bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Valor do Pedágio</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(toll)}</p>
              </div>
              <Map className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-orange shadow-elevation sm:col-span-1 lg:col-span-1 bg-brand-orange/5 border-t-0 border-r-0 border-b-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-bold text-brand-orange uppercase tracking-wider">
                  Valor Total
                </p>
                <p className="text-3xl font-black text-brand-blue">{formatCurrency(total)}</p>
              </div>
              <Banknote className="h-8 w-8 text-brand-orange opacity-40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elevation bg-white border-0">
        <CardHeader className="bg-slate-50/50 border-b pb-4 rounded-t-xl">
          <CardTitle className="text-lg flex items-center gap-2 text-brand-blue">
            <Route className="h-5 w-5" />
            Resumo da Rota
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Destino
            </p>
            <p className="font-semibold text-slate-900">{route.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">UF / Região</p>
            <p className="font-semibold text-slate-900">
              {route.uf} - {route.region}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Distância (KM)</p>
            <p className="font-semibold text-slate-900">
              {route.distanceKm.toLocaleString('pt-BR')} km
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Veículo Selecionado</p>
            <p className="font-semibold text-slate-900">{vehicle.name}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
