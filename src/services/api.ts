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
