routerAdd(
  'POST',
  '/backend/v1/calcular-tarifa-base',
  (e) => {
    const body = e.requestInfo().body
    const rotaId = body.rota_id
    const tipoVeiculo = body.tipo_veiculo
    const pesoKg = parseFloat(body.peso_kg) || 0
    const volumeM3 = parseFloat(body.volume_m3) || 0

    if (!rotaId || !tipoVeiculo) {
      throw new BadRequestError('Parâmetros rota_id e tipo_veiculo são obrigatórios.')
    }

    let rota
    try {
      rota = $app.findRecordById('rotas', rotaId)
    } catch (err) {
      throw new NotFoundError('Rota não encontrada.')
    }

    let tarifa
    try {
      tarifa = $app.findFirstRecordByFilter(
        'tarifas',
        'rota_id = {:rota_id} && tipo_veiculo = {:tipo_veiculo}',
        { rota_id: rotaId, tipo_veiculo: tipoVeiculo },
      )
    } catch (err) {
      throw new NotFoundError('Tarifa não encontrada para este veículo nesta rota.')
    }

    const km = rota.getInt('km')
    const valorTarifaPorKm = tarifa.getFloat('valor_tarifa_km')
    const valorTarifaBase = km * valorTarifaPorKm

    // Calculamos valores adicionais mantendo as regras de negócio
    const dieselCost = km * 1.5
    const weightBonus = pesoKg * 0.1
    const volumeBonus = volumeM3 * 2
    const toll = 0 // Pedágio agora é calculado separadamente
    const total = valorTarifaBase + dieselCost + toll + weightBonus + volumeBonus

    let dataVigencia = tarifa.getString('data_vigencia_fim')
    if (!dataVigencia) {
      dataVigencia = tarifa.getString('data_vigencia_inicio')
    }
    if (!dataVigencia) {
      dataVigencia = 'N/A'
    }

    const rotaObj = {
      id: rota.id,
      destino: rota.getString('destino'),
      uf: rota.getString('uf'),
      regiao: rota.getString('regiao'),
      km: km,
    }

    return e.json(200, {
      rota: rotaObj,
      tipo_veiculo: tipoVeiculo,
      km: km,
      valor_tarifa_por_km: valorTarifaPorKm,
      valor_tarifa_base: valorTarifaBase,
      valor_diesel: dieselCost,
      valor_pedagio: toll,
      valor_total: total,
      data_vigencia: dataVigencia,
    })
  },
  $apis.requireAuth(),
)
