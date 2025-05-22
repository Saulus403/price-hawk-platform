
import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { mockProducts, mockMarkets, mockPriceRecords } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PriceOrigin } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';

const ContributorCollect = () => {
  const { currentUser } = useAuth();
  
  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return mockProducts;
    
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  
  // Get user's price collection history
  const userHistory = mockPriceRecords.filter(record => 
    record.userId === currentUser?.id
  ).sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || !selectedMarketId || !price) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // In a real app, this would save to a database
    toast.success('Preço registrado com sucesso!');
    
    // Reset form
    setSelectedProductId('');
    setSelectedMarketId('');
    setPrice('');
    setNotes('');
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Coletar Preços</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Novo Registro de Preço</CardTitle>
            <CardDescription>
              Informe os detalhes do produto e o preço observado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productSearch">Produto</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="productSearch"
                    placeholder="Busque o produto pelo nome ou marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 mb-2"
                  />
                </div>
                
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {product.brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="market">Mercado</Label>
                <Select value={selectedMarketId} onValueChange={setSelectedMarketId}>
                  <SelectTrigger id="market">
                    <SelectValue placeholder="Selecione o mercado" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMarkets.map((market) => (
                      <SelectItem key={market.id} value={market.id}>
                        {market.name} - {market.neighborhood}, {market.city}/{market.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione informações relevantes sobre o preço..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full">Registrar Preço</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meu Histórico de Coletas</CardTitle>
            <CardDescription>
              Preços que você registrou anteriormente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Você ainda não registrou nenhum preço.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userHistory.slice(0, 5).map((record) => {
                  const product = mockProducts.find(p => p.id === record.productId);
                  const market = mockMarkets.find(m => m.id === record.marketId);
                  const collectedDate = new Date(record.collectedAt);
                  
                  return (
                    <div key={record.id} className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{product?.name}</h3>
                          <p className="text-sm text-muted-foreground">{product?.brand}</p>
                          <p className="text-xs mt-1">
                            {market?.name} - {market?.city}/{market?.state}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            R$ {record.price.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(collectedDate, "d 'de' MMMM, yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ContributorCollect;
