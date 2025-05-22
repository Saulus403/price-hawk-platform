
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { mockDelegatedTasks, mockUsers, mockProducts, mockMarkets } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ListTodo, Plus } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TaskStatus, UserRole } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const AdminTasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const auditors = mockUsers.filter(user => user.role === UserRole.AUDITOR);
  
  let filteredTasks = [...mockDelegatedTasks];
  
  // Filter by status
  if (filterStatus !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
  }
  
  // Filter by search term
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(task => {
      const product = mockProducts.find(p => p.id === task.productId);
      const market = mockMarkets.find(m => m.id === task.marketId);
      const auditor = mockUsers.find(u => u.id === task.auditorId);
      
      return (
        product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auditor?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }
  
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendente</Badge>;
      case TaskStatus.COMPLETED:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Concluída</Badge>;
      case TaskStatus.EXPIRED:
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
    
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tarefas</h1>
          
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Nova Tarefa
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Tarefas</CardTitle>
            <CardDescription>
              Visualize e gerencie as tarefas delegadas aos auditores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por produto, mercado ou auditor..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value={TaskStatus.PENDING}>Pendentes</SelectItem>
                  <SelectItem value={TaskStatus.COMPLETED}>Concluídas</SelectItem>
                  <SelectItem value={TaskStatus.EXPIRED}>Expiradas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Mercado</TableHead>
                    <TableHead>Auditor</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Nenhuma tarefa encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map(task => {
                      const product = mockProducts.find(p => p.id === task.productId);
                      const market = mockMarkets.find(m => m.id === task.marketId);
                      const auditor = mockUsers.find(u => u.id === task.auditorId);
                      const deadline = new Date(task.deadline);
                      
                      return (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{product?.name}</TableCell>
                          <TableCell>{market?.name}</TableCell>
                          <TableCell>{auditor?.name}</TableCell>
                          <TableCell>{format(deadline, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2">
                              Detalhes
                            </Button>
                            <Button variant="destructive" size="sm">
                              Cancelar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
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

export default AdminTasks;
