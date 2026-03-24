migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    if (!users.fields.getByName('tipo_acesso')) {
      users.fields.add(
        new SelectField({ name: 'tipo_acesso', values: ['CONSULTA', 'ADMINISTRADOR'] }),
      )
      app.save(users)
    }
  },
  (app) => {},
)
