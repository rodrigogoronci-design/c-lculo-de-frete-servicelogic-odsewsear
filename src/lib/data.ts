export type Region = 'NORTE' | 'NORDESTE' | 'CENTRO-OESTE' | 'SUDESTE' | 'SUL' | 'TODAS'

export interface RouteData {
  id: string
  name: string
  uf: string
  region: string
  distanceKm: number
}

export interface VehicleType {
  id: string
  name: string
  multiplier: number
}

export const vehicles: VehicleType[] = [
  { id: 'LS_6_EIXOS', name: 'LS 6 eixos', multiplier: 1.0 },
  { id: 'VANDERLEIA_6_EIXOS', name: 'Vanderleia 6 eixos', multiplier: 1.1 },
  { id: 'SUPER_LS_7_EIXOS', name: 'Super LS 7 eixos', multiplier: 1.2 },
  { id: 'SUPER_BITREM_9_EIXOS', name: 'Super Bitrem 9 eixos', multiplier: 1.5 },
]
