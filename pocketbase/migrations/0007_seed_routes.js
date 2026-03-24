migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    try {
      app.findAuthRecordByEmail('users', 'rodrigogoronci@gmail.com')
    } catch (_) {
      const admin = new Record(users)
      admin.setEmail('rodrigogoronci@gmail.com')
      admin.setPassword('securepassword123')
      admin.setVerified(true)
      admin.set('tipo_acesso', 'ADMINISTRADOR')
      admin.set('name', 'Admin Service Logic')
      app.save(admin)
    }

    const rotas = app.findCollectionByNameOrId('rotas')
    const tarifas = app.findCollectionByNameOrId('tarifas')

    const routesData = [
      { destino: 'Brasiléia', uf: 'AC', regiao: 'NORTE', km: 3500 },
      { destino: 'Cruzeiro do Sul', uf: 'AC', regiao: 'NORTE', km: 4000 },
      { destino: 'Rio Branco', uf: 'AC', regiao: 'NORTE', km: 3200 },
      { destino: 'Arapiraca', uf: 'AL', regiao: 'NORDESTE', km: 2300 },
      { destino: 'Maceió', uf: 'AL', regiao: 'NORDESTE', km: 2400 },
      { destino: 'Porto Calvo', uf: 'AL', regiao: 'NORDESTE', km: 2450 },
      { destino: 'Rio Largo', uf: 'AL', regiao: 'NORDESTE', km: 2420 },
      { destino: 'Santana do Ipanema', uf: 'AL', regiao: 'NORDESTE', km: 2200 },
      { destino: 'São Sebastião', uf: 'AL', regiao: 'NORDESTE', km: 2350 },
      { destino: 'Macapá', uf: 'AP', regiao: 'NORTE', km: 3100 },
      { destino: 'Santana', uf: 'AP', regiao: 'NORTE', km: 3150 },
      { destino: 'Alagoinhas', uf: 'BA', regiao: 'NORDESTE', km: 1800 },
      { destino: 'Barreiras', uf: 'BA', regiao: 'NORDESTE', km: 1500 },
      { destino: 'Camaçari', uf: 'BA', regiao: 'NORDESTE', km: 1950 },
      { destino: 'Candeias', uf: 'BA', regiao: 'NORDESTE', km: 1980 },
      { destino: 'Eunápolis', uf: 'BA', regiao: 'NORDESTE', km: 1200 },
      { destino: 'Feira de Santana', uf: 'BA', regiao: 'NORDESTE', km: 1850 },
      { destino: 'Ilhéus', uf: 'BA', regiao: 'NORDESTE', km: 1500 },
    ]

    for (const rd of routesData) {
      const existing = app.findRecordsByFilter('rotas', `destino = '${rd.destino}'`, '', 1, 0)
      if (existing.length === 0) {
        const r = new Record(rotas)
        r.set('destino', rd.destino)
        r.set('uf', rd.uf)
        r.set('regiao', rd.regiao)
        r.set('km', rd.km)
        app.save(r)

        const t = new Record(tarifas)
        t.set('rota_id', r.id)
        t.set('tipo_veiculo', 'LS_6_EIXOS')
        t.set('valor_tarifa_km', 6.5)
        t.set('valor_tarifa_total', rd.km * 6.5)
        app.save(t)
      }
    }
  },
  (app) => {},
)
