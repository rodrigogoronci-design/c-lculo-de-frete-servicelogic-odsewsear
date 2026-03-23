export type Region = 'NORTE' | 'NORDESTE' | 'CENTRO-OESTE' | 'SUDESTE' | 'SUL'

export interface RouteData {
  id: string
  name: string
  uf: string
  region: Region
  distanceKm: number
  baseRate: number
  adjustedRate: number
  toll: number
}

export interface VehicleType {
  id: string
  name: string
  multiplier: number
}

export const vehicles: VehicleType[] = [
  { id: 'ls6', name: 'LS 6 eixos', multiplier: 1.0 },
  { id: 'van6', name: 'Vanderleia 6 eixos', multiplier: 1.1 },
  { id: 'sls7', name: 'Super LS 7 eixos', multiplier: 1.2 },
  { id: 'sb9', name: 'Super Bitrem 9 eixos', multiplier: 1.5 },
]

export const destinations: RouteData[] = [
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    uf: 'SP',
    region: 'SUDESTE',
    distanceKm: 0,
    baseRate: 800,
    adjustedRate: 880,
    toll: 120,
  },
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    uf: 'RJ',
    region: 'SUDESTE',
    distanceKm: 430,
    baseRate: 2150,
    adjustedRate: 2365,
    toll: 320,
  },
  {
    id: 'belo-horizonte',
    name: 'Belo Horizonte',
    uf: 'MG',
    region: 'SUDESTE',
    distanceKm: 586,
    baseRate: 2930,
    adjustedRate: 3223,
    toll: 410,
  },
  {
    id: 'curitiba',
    name: 'Curitiba',
    uf: 'PR',
    region: 'SUL',
    distanceKm: 400,
    baseRate: 2000,
    adjustedRate: 2200,
    toll: 280,
  },
  {
    id: 'porto-alegre',
    name: 'Porto Alegre',
    uf: 'RS',
    region: 'SUL',
    distanceKm: 1100,
    baseRate: 5500,
    adjustedRate: 6050,
    toll: 750,
  },
  {
    id: 'brasilia',
    name: 'Brasília',
    uf: 'DF',
    region: 'CENTRO-OESTE',
    distanceKm: 1000,
    baseRate: 5000,
    adjustedRate: 5500,
    toll: 680,
  },
  {
    id: 'salvador',
    name: 'Salvador',
    uf: 'BA',
    region: 'NORDESTE',
    distanceKm: 1900,
    baseRate: 9500,
    adjustedRate: 10450,
    toll: 890,
  },
  {
    id: 'recife',
    name: 'Recife',
    uf: 'PE',
    region: 'NORDESTE',
    distanceKm: 2600,
    baseRate: 13000,
    adjustedRate: 14300,
    toll: 1100,
  },
  {
    id: 'fortaleza',
    name: 'Fortaleza',
    uf: 'CE',
    region: 'NORDESTE',
    distanceKm: 2800,
    baseRate: 14000,
    adjustedRate: 15400,
    toll: 1250,
  },
  {
    id: 'manaus',
    name: 'Manaus',
    uf: 'AM',
    region: 'NORTE',
    distanceKm: 3800,
    baseRate: 19000,
    adjustedRate: 20900,
    toll: 0,
  },
  {
    id: 'belem',
    name: 'Belém',
    uf: 'PA',
    region: 'NORTE',
    distanceKm: 2900,
    baseRate: 14500,
    adjustedRate: 15950,
    toll: 800,
  },
  {
    id: 'goiania',
    name: 'Goiânia',
    uf: 'GO',
    region: 'CENTRO-OESTE',
    distanceKm: 900,
    baseRate: 4500,
    adjustedRate: 4950,
    toll: 620,
  },
  {
    id: 'campinas',
    name: 'Campinas',
    uf: 'SP',
    region: 'SUDESTE',
    distanceKm: 100,
    baseRate: 900,
    adjustedRate: 990,
    toll: 80,
  },
  {
    id: 'sao-luis',
    name: 'São Luís',
    uf: 'MA',
    region: 'NORDESTE',
    distanceKm: 2900,
    baseRate: 14500,
    adjustedRate: 15950,
    toll: 950,
  },
  {
    id: 'maceio',
    name: 'Maceió',
    uf: 'AL',
    region: 'NORDESTE',
    distanceKm: 2400,
    baseRate: 12000,
    adjustedRate: 13200,
    toll: 1050,
  },
  {
    id: 'natal',
    name: 'Natal',
    uf: 'RN',
    region: 'NORDESTE',
    distanceKm: 2900,
    baseRate: 14500,
    adjustedRate: 15950,
    toll: 1150,
  },
  {
    id: 'joao-pessoa',
    name: 'João Pessoa',
    uf: 'PB',
    region: 'NORDESTE',
    distanceKm: 2700,
    baseRate: 13500,
    adjustedRate: 14850,
    toll: 1120,
  },
  {
    id: 'teresina',
    name: 'Teresina',
    uf: 'PI',
    region: 'NORDESTE',
    distanceKm: 2600,
    baseRate: 13000,
    adjustedRate: 14300,
    toll: 1000,
  },
]
