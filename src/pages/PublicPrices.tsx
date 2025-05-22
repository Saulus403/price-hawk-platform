
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockPriceRecords, mockProducts, mockMarkets } from '@/data/mockData';
import { PriceOrigin } from '@/types';
import Layout from '@/components/layout/Layout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search } from 'lucide-react';

const PublicPrices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  
  // Get unique cities from markets
  const cities = useMemo(() => {
    const uniqueCities = new Set(mockMarkets.map(market => market.city));
    return Array.from(uniqueCities);
  }, []);
  
  // Get neighborhoods for selected city
  const neighborhoods = useMemo(() => {
    if (!selectedCity) return [];
    const marketsInCity = mockMarkets.filter(market => market.city === selectedCity);
    const uniqueNeighborhoods = new Set(marketsInCity.map(market => market.neighborhood));
    return Array.from(uniqueNeighborhoods);
  }, [selectedCity]);
  
  // Filter price records based on search term and filters
  const filteredPriceRecords = useMemo(() => {
    // Get the latest price record for each product-market combination
    const latestPrices = mockPriceRecords.reduce((acc, record) => {
      const key = `${record.productId}-${record.marketId}`;
      if (!acc[key] || new Date(record.collectedAt) > new Date(acc[key].collectedAt)) {
        acc[key] = record;
      }
      return acc;
    }, {} as Record<string, typeof mockPriceRecords[0]>);
    
    // Convert to array and filter
    return Object.values(latestPrices).filter(record => {
      const product = mockProducts.find(p => p.id === record.productId);
      const market = mockMarkets.find(m => m.id === record.marketId);
      
      if (!product || !market) return false;
      
      const matchesSearch = 
        searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCity === '' || market.city === selectedCity;
      
      const matchesNeighborhood = 
        selectedNeighborhood === '' || market.neighborhood === selectedNeighborhood;
      
      return matchesSearch && matchesCity && matchesNeighborhood;
    });
  }, [searchTerm, selectedCity, selectedNeighborhood]);
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Consulta de Preços</h1>
        
        <div className="bg-card rounded-xl p-6 shadow mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as cidades</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={selectedNeighborhood} 
              onValueChange={setSelectedNeighborhood}
              disabled={!selectedCity}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os bairros</SelectItem>
                {neighborhoods.map(neighborhood => (
                  <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredPriceRecords.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou buscar outro produto</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPriceRecords.map(record => {
              const product = mockProducts.find(p => p.id === record.productId);
              const market = mockMarkets.find(m => m.id === record.marketId);
              
              if (!product || !market) return null;
              
              const collectedDate = new Date(record.collectedAt);
              const formattedDate = format(collectedDate, "d 'de' MMMM, yyyy", { locale: ptBR });
              
              return (
                <div 
                  key={record.id} 
                  className="bg-card rounded-lg overflow-hidden shadow border border-border"
                >
                  <div className="p-4 border-b border-border">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <Badge 
                        variant="outline"
                        className={
                          record.origin === PriceOrigin.AUDITOR 
                            ? 'bg-auditor text-white' 
                            : 'bg-contributor text-black'
                        }
                      >
                        {record.origin === PriceOrigin.AUDITOR ? 'Auditor' : 'Colaborador'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                  </div>
                  
                  <div className="p-4 border-b border-border">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{market.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {market.neighborhood}, {market.city} - {market.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          R$ {record.price.toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-xs text-muted-foreground">{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <Button variant="ghost" size="sm" className="w-full">
                      Ver histórico
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PublicPrices;
