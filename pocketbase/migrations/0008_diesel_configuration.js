migrate(
  (app) => {
    const collection = new Collection({
      name: 'configuracoes_diesel',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.tipo_acesso = 'ADMINISTRADOR'",
      updateRule: "@request.auth.tipo_acesso = 'ADMINISTRADOR'",
      deleteRule: "@request.auth.tipo_acesso = 'ADMINISTRADOR'",
      fields: [
        { name: 'data_vigencia', type: 'date', required: true },
        { name: 'valor_diesel_base', type: 'number', required: true },
        { name: 'percentual_pre_gatilho', type: 'number', required: true },
        { name: 'percentual_pos_gatilho', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)

    const record = new Record(collection)
    record.set('data_vigencia', '2024-01-01 00:00:00.000Z')
    record.set('valor_diesel_base', 6.1)
    record.set('percentual_pre_gatilho', 25.0)
    record.set('percentual_pos_gatilho', 30.0)
    app.save(record)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('configuracoes_diesel')
    app.delete(collection)
  },
)
