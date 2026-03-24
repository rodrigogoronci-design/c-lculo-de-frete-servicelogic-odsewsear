routerAdd(
  'POST',
  '/backend/v1/calcular-diesel',
  (e) => {
    const body = e.requestInfo().body
    const rotaId = body.rota_id
    const valorTarifaBase = parseFloat(body.valor_tarifa_base) || 0
    const dataCalculoStr = body.data_calculo

    if (!rotaId || isNaN(valorTarifaBase) || !dataCalculoStr) {
      throw new BadRequestError(
        'Parâmetros rota_id, valor_tarifa_base e data_calculo são obrigatórios.',
      )
    }

    let config
    try {
      const records = $app.findRecordsByFilter(
        'configuracoes_diesel',
        'data_vigencia <= {:date}',
        '-data_vigencia',
        1,
        0,
        { date: dataCalculoStr + ' 23:59:59.999Z' },
      )

      if (records.length === 0) {
        const allRecords = $app.findRecordsByFilter(
          'configuracoes_diesel',
          '',
          '-data_vigencia',
          1,
          0,
        )
        if (allRecords.length === 0) {
          throw new NotFoundError('Configuração de diesel não encontrada para a data selecionada.')
        }
        config = allRecords[0]
      } else {
        config = records[0]
      }
    } catch (err) {
      throw new NotFoundError('Configuração de diesel não encontrada para a data selecionada.')
    }

    const triggerDateObj = new Date('2025-07-01T00:00:00.000Z')
    const calcDateObj = new Date(dataCalculoStr + 'T00:00:00.000Z')

    let selectedPercentual = 0
    if (calcDateObj < triggerDateObj) {
      selectedPercentual = config.getFloat('percentual_pre_gatilho')
    } else {
      selectedPercentual = config.getFloat('percentual_pos_gatilho')
    }

    const valorDiesel = valorTarifaBase * (selectedPercentual / 100)

    return e.json(200, {
      valor_tarifa_base: valorTarifaBase,
      percentual_diesel: selectedPercentual,
      valor_diesel: valorDiesel,
      data_vigencia: config.getString('data_vigencia').split(' ')[0],
    })
  },
  $apis.requireAuth(),
)
