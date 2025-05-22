
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDelegatedTasks, mockPriceRecords, mockProducts } from '@/data/mockData';
import { BarChart, PieChart } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatus, PriceOrigin } from '@/types';

const AdminDashboard = () => {
  // Métricas de tarefas
  const totalTasks = mockDelegatedTasks.length;
  const pendingTasks = mockDelegatedTasks.filter(task => task.status === TaskStatus.PENDING).length;
  const completedTasks = mockDelegatedTasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const expiredTasks = mockDelegatedTasks.filter(task => task.status === TaskStatus.EXPIRED).length;
  
  // Métricas de preços coletados
  const totalPrices = mockPriceRecords.length;
  const auditorPrices = mockPriceRecords.filter(record => record.origin === PriceOrigin.AUDITOR).length;
  const contributorPrices = mockPriceRecords.filter(record => record.origin === PriceOrigin.CONTRIBUTOR).length;
  
  // Dados para os gráficos
  const taskStatusData = [
    { name: 'Pendentes', value: pendingTasks, fill: '#3b82f6' },
    { name: 'Concluídas', value: completedTasks, fill: '#10b981' },
    { name: 'Expiradas', value: expiredTasks, fill: '#ef4444' },
  ];
  
  const priceOriginData = [
    { name: 'Auditores', value: auditorPrices, fill: '#0D9488' },
    { name: 'Colaboradores', value: contributorPrices, fill: '#F59E0B' },
  ];
  
  // Dados para o gráfico de barras de preços por produto
  const productsWithPrices = mockProducts.slice(0, 4).map(product => {
    const productPrices = mockPriceRecords.filter(record => record.productId === product.id);
    const avgPrice = productPrices.length 
      ? productPrices.reduce((sum, record) => sum + record.price, 0) / productPrices.length
      : 0;
    
    return {
      name: product.name,
      value: parseFloat(avgPrice.toFixed(2)),
    };
  });
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Tarefas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTasks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tarefas Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{pendingTasks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Preços Coletados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPrices}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {totalTasks === 0 ? '0%' : `${Math.round((completedTasks / totalTasks) * 100)}%`}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Status das Tarefas</CardTitle>
              <CardDescription>Distribuição de tarefas por status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PieChart
                  data={taskStatusData}
                  index="name"
                  categories={["value"]}
                  valueFormatter={(value) => `${value} tarefas`}
                  colors={["blue", "green", "red"]}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Origem dos Preços</CardTitle>
              <CardDescription>Preços coletados por tipo de usuário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PieChart
                  data={priceOriginData}
                  index="name"
                  categories={["value"]}
                  valueFormatter={(value) => `${value} preços`}
                  colors={["#0D9488", "#F59E0B"]}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Preço Médio por Produto</CardTitle>
            <CardDescription>Baseado em todas as coletas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart
                data={productsWithPrices}
                index="name"
                categories={["value"]}
                valueFormatter={(value) => `R$ ${value}`}
                colors={["#1E3A8A"]}
                className="h-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
