
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
import { Textarea } from '@/components/ui/textarea';
import { Barcode, Edit, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ContributorCollect = () => {
  const { currentUser } = useAuth();
  
  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [manualProductName, setManualProductName] = useState('');
  const [manualProductEan, setManualProductEan] = useState('');
  const [manualProductBrand, setManualProductBrand] = useState('');
  const [eanInput, setEanInput] = useState('');
  const [inputMethod, setInputMethod] = useState<'search' | 'barcode' | 'manual'>('search');
  
  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return mockProducts;
    
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm)
    );
  }, [searchTerm]);
  
  // Get user's price collection history
  const userHistory = mockPriceRecords.filter(record => 
    record.userId === currentUser?.id
  ).sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMethod === 'search' && !selectedProductId) {
      toast.error('Por favor, selecione um produto');
      return;
    }
    
    if (inputMethod === 'manual' && (!manualProductName || !manualProductEan)) {
      toast.error('Por favor, preencha os dados do produto');
      return;
    }
    
    if (inputMethod === 'barcode' && !eanInput) {
      toast.error('Por favor, escaneie ou digite o código de barras');
      return;
    }
    
    if (!selectedMarketId || !price) {
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
    setEanInput('');
    setManualProductName('');
    setManualProductEan('');
    setManualProductBrand('');
    setSearchTerm('');
  };
  
  const handleScanBarcode = () => {
    // In a real app, this would open the camera for barcode scanning
    // For this demo, we'll simulate finding a product by EAN
    
    const foundProduct = mockProducts.find(p => p.barcode === eanInput);
    
    if (foundProduct) {
      setSelectedProductId(foundProduct.id);
      toast.success(`Produto encontrado: ${foundProduct.name}`);
    } else {
      toast.error('Produto não encontrado. Por favor, verifique o código ou faça uma entrada manual.');
    }
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
            <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as any)} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Buscar
                </TabsTrigger>
                <TabsTrigger value="barcode" className="flex items-center gap-2">
                  <Barcode className="w-4 h-4" />
                  Código EAN
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Manual
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="search">
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
              </TabsContent>
              
              <TabsContent value="barcode">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="eanInput">Código de barras (EAN)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="eanInput"
                        placeholder="Escaneie ou digite o código de barras"
                        value={eanInput}
                        onChange={(e) => setEanInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleScanBarcode}>
                        <Barcode className="h-4 w-4 mr-2" />
                        Verificar
                      </Button>
                    </div>
                    
                    {selectedProductId && (
                      <div className="mt-2 p-2 bg-muted rounded">
                        <p className="font-medium">
                          {mockProducts.find(p => p.id === selectedProductId)?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mockProducts.find(p => p.id === selectedProductId)?.brand}
                        </p>
                      </div>
                    )}
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
              </TabsContent>
              
              <TabsContent value="manual">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manualProductName">Nome do Produto</Label>
                      <Input
                        id="manualProductName"
                        placeholder="Nome do produto"
                        value={manualProductName}
                        onChange={(e) => setManualProductName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manualProductBrand">Marca</Label>
                      <Input
                        id="manualProductBrand"
                        placeholder="Marca do produto"
                        value={manualProductBrand}
                        onChange={(e) => setManualProductBrand(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manualProductEan">Código EAN</Label>
                      <Input
                        id="manualProductEan"
                        placeholder="Código de barras (EAN)"
                        value={manualProductEan}
                        onChange={(e) => setManualProductEan(e.target.value)}
                      />
                    </div>
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
              </TabsContent>
            </Tabs>
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
