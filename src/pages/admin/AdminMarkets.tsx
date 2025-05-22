
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { mockMarkets } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Store, Plus } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MarketType } from '@/types';

const AdminMarkets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMarkets = searchTerm 
    ? mockMarkets.filter(market => 
        market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockMarkets;
    
  const getMarketTypeBadge = (type: MarketType) => {
    switch (type) {
      case MarketType.HYPERMARKET:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Hipermercado</Badge>;
      case MarketType.SUPERMARKET:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Supermercado</Badge>;
      case MarketType.WHOLESALE:
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Atacadista</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
    
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mercados</h1>
          
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Adicionar Mercado
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Mercados</CardTitle>
            <CardDescription>
              Visualize e gerencie os mercados cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, cidade ou bairro..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarkets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Nenhum mercado encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMarkets.map(market => (
                      <TableRow key={market.id}>
                        <TableCell className="font-medium">{market.name}</TableCell>
                        <TableCell>{market.neighborhood}, {market.city}/{market.state}</TableCell>
                        <TableCell>{getMarketTypeBadge(market.type)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2">
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminMarkets;
