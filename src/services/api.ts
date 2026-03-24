import pb from '@/lib/pocketbase/client'

export const getRotas = async () => {
  return await pb.collection('rotas').getFullList({ sort: 'destino' })
}

export const getTarifas = async (rotaId: string) => {
  return await pb.collection('tarifas').getFullList({ filter: `rota_id = "${rotaId}"` })
}

export const createCalculo = async (data: any) => {
  return await pb.collection('calculos_frete').create(data)
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
