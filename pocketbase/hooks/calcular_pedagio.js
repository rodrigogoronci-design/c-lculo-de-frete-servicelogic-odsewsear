routerAdd(
  'POST',
  '/backend/v1/calcular-pedagio',
  (e) => {
    const body = e.requestInfo().body
    const rotaId = body.rota_id
    const tipoVeiculo = body.tipo_veiculo

    if (!rotaId || !tipoVeiculo) {
      throw new BadRequestError('Parâmetros rota_id e tipo_veiculo são obrigatórios.')
    }

    let tarifa
    try {
      tarifa = $app.findFirstRecordByFilter(
        'tarifas',
        'rota_id = {:rota_id} && tipo_veiculo = {:tipo_veiculo}',
        { rota_id: rotaId, tipo_veiculo: tipoVeiculo },
      )
    } catch (err) {
      throw new NotFoundError('Tarifa/Pedágio não encontrado para esta rota e veículo')
    }

    let valorPedagio = 0
    if (tipoVeiculo === 'SUPER_BITREM_9_EIXOS') {
      valorPedagio = tarifa.getFloat('valor_pedagio') || 0
    }

    return e.json(200, {
      tipo_veiculo: tipoVeiculo,
      valor_pedagio: valorPedagio,
    })
  },
  $apis.requireAuth(),
)
