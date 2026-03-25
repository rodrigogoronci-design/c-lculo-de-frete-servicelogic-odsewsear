migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('tarifas')
    if (!col.fields.getByName('valor_pedagio')) {
      col.fields.add(new NumberField({ name: 'valor_pedagio' }))
      app.save(col)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('tarifas')
    if (col.fields.getByName('valor_pedagio')) {
      col.fields.removeByName('valor_pedagio')
      app.save(col)
    }
  },
)
