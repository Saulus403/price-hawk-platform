
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart } from '@/components/ui/charts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [priceRecords, setPriceRecords] = useState<any[]>([]);
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);
  
  // Fetch price records and set up real-time subscription
  useEffect(() => {
    if (currentUser?.companyId) {
      fetchPriceRecords();
      setupRealtimeSubscription();
    }
    
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [currentUser?.companyId]);
  
  const fetchPriceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('precos_coletados')
        .select(`
          *,
          product:produto_id (name, brand, barcode),
          alimentador:alimentador_id (nome, email)
        `)
        .eq('empresa_id', currentUser?.companyId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      console.log('Fetched price records:', data);
      setPriceRecords(data || []);
    } catch (error: any) {
      console.error('Error fetching price records:', error.message);
      toast.error('Erro ao carregar dados de preços');
    }
  };
  
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('price-records-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'precos_coletados',
          filter: `empresa_id=eq.${currentUser?.companyId}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Refresh data when changes occur
          fetchPriceRecords();
          
          if (payload.eventType === 'INSERT') {
            toast.success('Novo preço coletado!');
          }
        }
      )
      .subscribe();
      
    setRealtimeChannel(channel);
  };
  
  // Calculate metrics
  const totalPrices = priceRecords.length;
  const todayPrices = priceRecords.filter(record => {
    const recordDate = new Date(record.created_at);
    const today = new Date();
    return recordDate.toDateString() === today.toDateString();
  }).length;
  
  const uniqueProducts = new Set(priceRecords.map(record => record.produto_id)).size;
  const uniqueMarkets = new Set(priceRecords.map(record => record.mercado_nome)).size;
  
  // Data for charts
  const pricesByOrigin = [
    { 
      name: 'Alimentadores', 
      value: priceRecords.filter(record => record.origem === 'alimentador').length,
      fill: '#0D9488' 
    },
    { 
      name: 'Auditores', 
      value: priceRecords.filter(record => record.origem === 'auditor').length,
      fill: '#F59E0B' 
    },
  ];
  
  // Top products by number of price records
  const productCounts = priceRecords.reduce((acc: any, record) => {
    const productName = record.product?.name || 'Produto Desconhecido';
    acc[productName] = (acc[productName] || 0) + 1;
    return acc;
  }, {});
  
  const topProducts = Object.entries(productCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      value: count as number,
    }));
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os dados</SelectItem>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Preços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPrices}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Preços Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{todayPrices}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Produtos Únicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{uniqueProducts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mercados Únicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{uniqueMarkets}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Origem dos Preços</CardTitle>
              <CardDescription>Preços coletados por tipo de usuário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PieChart
                  data={pricesByOrigin}
                  index="name"
                  categories={["value"]}
                  valueFormatter={(value) => `${value} preços`}
                  colors={["#0D9488", "#F59E0B"]}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Coletados</CardTitle>
              <CardDescription>Top 5 produtos por número de registros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={topProducts}
                  index="name"
                  categories={["value"]}
                  valueFormatter={(value) => `${value} registros`}
                  colors={["#1E3A8A"]}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Últimos Preços Coletados</CardTitle>
            <CardDescription>Preços coletados em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            {priceRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum preço foi coletado ainda.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {priceRecords.slice(0, 10).map((record) => {
                  const collectedDate = new Date(record.created_at);
                  
                  return (
                    <div key={record.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{record.product?.name || 'Produto não encontrado'}</h3>
                          <p className="text-sm text-muted-foreground">{record.product?.brand}</p>
                          <p className="text-xs mt-1">
                            {record.mercado_nome} • Por: {record.alimentador?.nome}
                          </p>
                          {record.notas && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Obs: {record.notas}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            R$ {record.valor.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(collectedDate, "d 'de' MMM, HH:mm", { locale: ptBR })}
                          </p>
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                            {record.origem}
                          </span>
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

export default AdminDashboard;
