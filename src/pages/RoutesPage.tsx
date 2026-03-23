import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { destinations, Region } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function RoutesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<Region | 'TODAS'>('TODAS')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredRoutes = useMemo(() => {
    return destinations.filter((route) => {
      const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRegion = selectedRegion === 'TODAS' || route.region === selectedRegion
      return matchesSearch && matchesRegion
    })
  }, [searchTerm, selectedRegion])

  useMemo(() => setCurrentPage(1), [searchTerm, selectedRegion])

  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage)
  const paginatedRoutes = filteredRoutes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )
  const regions: (Region | 'TODAS')[] = [
    'TODAS',
    'NORTE',
    'NORDESTE',
    'CENTRO-OESTE',
    'SUDESTE',
    'SUL',
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-brand-blue tracking-tight">
          Tabela de Consulta de Rotas
        </h1>
        <p className="text-slate-600">
          Explore os corredores logísticos disponíveis, distâncias e tarifas de referência.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por destino..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs
          value={selectedRegion}
          onValueChange={(v) => setSelectedRegion(v as Region | 'TODAS')}
          className="w-full lg:w-auto overflow-x-auto"
        >
          <TabsList className="w-full justify-start h-auto p-1 bg-slate-100">
            {regions.map((r) => (
              <TabsTrigger
                key={r}
                value={r}
                className="text-xs md:text-sm data-[state=active]:bg-brand-blue data-[state=active]:text-white"
              >
                {r}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-white rounded-xl border shadow-elevation overflow-hidden">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Destino</TableHead>
                <TableHead>UF</TableHead>
                <TableHead>Região</TableHead>
                <TableHead>KM</TableHead>
                <TableHead>Tarifa Base (até 30/06)</TableHead>
                <TableHead>Reajustada (01/07)</TableHead>
                <TableHead>Pedágio</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoutes.length > 0 ? (
                paginatedRoutes.map((route) => (
                  <TableRow
                    key={route.id}
                    className="hover:bg-brand-blue/5 transition-colors group"
                  >
                    <TableCell className="font-medium text-brand-blue">{route.name}</TableCell>
                    <TableCell>{route.uf}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100 text-slate-700">
                        {route.region}
                      </Badge>
                    </TableCell>
                    <TableCell>{route.distanceKm.toLocaleString('pt-BR')} km</TableCell>
                    <TableCell>{formatCurrency(route.baseRate)}</TableCell>
                    <TableCell className="text-brand-orange font-medium">
                      {formatCurrency(route.adjustedRate)}
                    </TableCell>
                    <TableCell>{formatCurrency(route.toll)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
                        onClick={() => navigate(`/?destination=${route.id}`)}
                      >
                        Selecionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                    Nenhuma rota encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden grid grid-cols-1 gap-4 p-4">
          {paginatedRoutes.length > 0 ? (
            paginatedRoutes.map((route) => (
              <Card
                key={route.id}
                className="overflow-hidden border-l-4 border-l-brand-blue shadow-sm"
              >
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-brand-blue flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {route.name} - {route.uf}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {route.region} • {route.distanceKm} km
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-50 p-2 rounded">
                      <p className="text-slate-500 text-xs">Tarifa Base</p>
                      <p className="font-medium">{formatCurrency(route.baseRate)}</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded">
                      <p className="text-brand-orange text-xs">Reajustada</p>
                      <p className="font-medium text-brand-orange">
                        {formatCurrency(route.adjustedRate)}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-brand-orange hover:bg-orange-600 text-white"
                    onClick={() => navigate(`/?destination=${route.id}`)}
                  >
                    Calcular Frete <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">Nenhuma rota encontrada.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t p-4 flex justify-center bg-slate-50">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(i + 1)
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
