
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Barcode, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const ContributorCollect = () => {
  const { currentUser } = useAuth();
  
  // Form states
  const [marketName, setMarketName] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [manualProductName, setManualProductName] = useState('');
  const [manualProductEan, setManualProductEan] = useState('');
  const [manualProductBrand, setManualProductBrand] = useState('');
  const [eanInput, setEanInput] = useState('');
  const [inputMethod, setInputMethod] = useState<'barcode' | 'manual'>('barcode');
  const [foundProduct, setFoundProduct] = useState<any>(null);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch user history on component mount
  useEffect(() => {
    if (currentUser?.id) {
      fetchUserHistory();
    }
  }, [currentUser?.id]);
  
  const fetchUserHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('precos_coletados')
        .select(`
          *,
          product:produto_id (name, brand, barcode)
        `)
        .eq('alimentador_id', currentUser?.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      setUserHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching history:', error.message);
      toast.error('Erro ao carregar histórico');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Usuário não autenticado');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (inputMethod === 'manual' && (!manualProductName || !manualProductEan)) {
        toast.error('Por favor, preencha os dados do produto');
        return;
      }
      
      if (inputMethod === 'barcode' && !eanInput) {
        toast.error('Por favor, escaneie ou digite o código de barras');
        return;
      }
      
      if (!marketName || !price) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      
      let productId;
      
      // Handle product based on input method
      if (inputMethod === 'barcode') {
        // If product was found by barcode, use it
        if (foundProduct) {
          productId = foundProduct.id;
        } else {
          toast.error('Produto não encontrado. Por favor use a entrada manual.');
          return;
        }
      } else {
        // For manual entry, first check if barcode already exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('barcode', manualProductEan)
          .limit(1);
          
        if (existingProduct && existingProduct.length > 0) {
          productId = existingProduct[0].id;
        } else {
          // Create new product
          const { data: newProduct, error: productError } = await supabase
            .from('products')
            .insert({
              name: manualProductName,
              brand: manualProductBrand || null,
              barcode: manualProductEan
            })
            .select()
            .single();
            
          if (productError) throw productError;
          productId = newProduct.id;
        }
      }
      
      // Create price record in precos_coletados table
      const { error: priceError } = await supabase
        .from('precos_coletados')
        .insert({
          produto_id: productId,
          mercado_nome: marketName,
          valor: parseFloat(price),
          data_atualizacao: new Date().toISOString(),
          alimentador_id: currentUser.id,
          empresa_id: currentUser.companyId,
          notas: notes || null,
          origem: 'alimentador'
        });
        
      if (priceError) throw priceError;
      
      // Success
      toast.success('Preço registrado com sucesso!');
      
      // Reset form
      setMarketName('');
      setPrice('');
      setNotes('');
      setEanInput('');
      setManualProductName('');
      setManualProductEan('');
      setManualProductBrand('');
      setFoundProduct(null);
      
      // Refresh history
      fetchUserHistory();
      
    } catch (error: any) {
      console.error('Error saving data:', error.message);
      toast.error('Erro ao salvar dados');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScanBarcode = async () => {
    if (!eanInput) {
      toast.error('Por favor, digite um código de barras');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if product exists in our database
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', eanInput)
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFoundProduct(data[0]);
        toast.success(`Produto encontrado: ${data[0].name}`);
      } else {
        setFoundProduct(null);
        toast.error('Produto não encontrado. Por favor, faça uma entrada manual.');
        
        // Pre-fill the manual entry form with the EAN
        setManualProductEan(eanInput);
        setInputMethod('manual');
      }
    } catch (error: any) {
      console.error('Error checking product:', error.message);
      toast.error('Erro ao verificar produto');
    } finally {
      setIsLoading(false);
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="barcode" className="flex items-center gap-2">
                  <Barcode className="w-4 h-4" />
                  Código EAN
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Manual
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <TabsContent value="barcode">
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
                      <Button 
                        type="button" 
                        onClick={handleScanBarcode}
                        disabled={isLoading}
                      >
                        <Barcode className="h-4 w-4 mr-2" />
                        Verificar
                      </Button>
                    </div>
                    
                    {foundProduct && (
                      <div className="mt-2 p-2 bg-muted rounded">
                        <p className="font-medium">{foundProduct.name}</p>
                        <p className="text-sm text-muted-foreground">{foundProduct.brand}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="manual">
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
                </TabsContent>
                
                <div className="space-y-2">
                  <Label htmlFor="market">Nome do Mercado</Label>
                  <Input
                    id="market"
                    placeholder="Digite o nome do mercado"
                    value={marketName}
                    onChange={(e) => setMarketName(e.target.value)}
                  />
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
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Registrar Preço'}
                </Button>
              </form>
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
                {userHistory.map((record) => {
                  const collectedDate = new Date(record.created_at);
                  
                  return (
                    <div key={record.id} className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{record.product?.name}</h3>
                          <p className="text-sm text-muted-foreground">{record.product?.brand}</p>
                          <p className="text-xs mt-1">
                            {record.mercado_nome}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            R$ {record.valor.toFixed(2).replace('.', ',')}
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
