import pb from '@/lib/pocketbase/client'
import { ClientResponseError } from 'pocketbase'

export const getRotas = async () => {
  return await pb.collection('rotas').getFullList({ sort: 'destino' })
}

export const getTarifas = async (rotaId: string) => {
  return await pb.collection('tarifas').getFullList({ filter: `rota_id = "${rotaId}"` })
}

export interface CreateCalculoPayload {
  usuario_id: string
  rota_id: string
  tipo_veiculo: string
  peso_kg: number
  volume_m3: number
  valor_tarifa_base: number
  valor_diesel: number
  valor_pedagio: number
  valor_total: number
  data_calculo: string
}

export const createCalculo = async (data: CreateCalculoPayload) => {
  try {
    return await pb.collection('calculos_frete').create(data)
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 400) {
      console.error('Validation error when creating calculos_frete:', error.response?.data)
    }
    throw error
  }
}

export const calcularTarifaBase = async (data: {
  rota_id: string
  tipo_veiculo: string
  peso_kg: number
  volume_m3: number
}) => {
  return await pb.send('/backend/v1/calcular-tarifa-base', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const calcularDiesel = async (data: {
  rota_id: string
  valor_tarifa_base: number
  data_calculo: string
}) => {
  return await pb.send('/backend/v1/calcular-diesel', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const calcularPedagio = async (data: { rota_id: string; tipo_veiculo: string }) => {
  return await pb.send('/backend/v1/calcular-pedagio', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
