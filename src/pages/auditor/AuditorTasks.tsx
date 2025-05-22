
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { mockDelegatedTasks } from '@/data/mockData';
import { TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

const AuditorTasks = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<typeof mockDelegatedTasks[0] | null>(null);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  
  // Filter tasks for the current auditor
  const auditorTasks = mockDelegatedTasks.filter(task => task.auditorId === currentUser?.id);
  
  const pendingTasks = auditorTasks.filter(task => task.status === TaskStatus.PENDING);
  const completedTasks = auditorTasks.filter(task => task.status === TaskStatus.COMPLETED);
  const expiredTasks = auditorTasks.filter(task => task.status === TaskStatus.EXPIRED);
  
  const handleOpenDialog = (task: typeof mockDelegatedTasks[0]) => {
    setSelectedTask(task);
    setPrice('');
    setNotes('');
    setDialogOpen(true);
  };
  
  const handleCompleteTask = () => {
    if (!price) {
      toast.error('Por favor, informe o preço coletado');
      return;
    }
    
    // In a real app, this would update the task in the backend
    // For this demo, we'll just show a success message
    toast.success('Tarefa marcada como concluída com sucesso!');
    setDialogOpen(false);
  };
  
  const renderTaskCard = (task: typeof mockDelegatedTasks[0]) => {
    const deadlineDate = new Date(task.deadline);
    const isExpired = deadlineDate < new Date() && task.status === TaskStatus.PENDING;
    const formattedDeadline = format(deadlineDate, "d 'de' MMMM, yyyy", { locale: ptBR });
    
    return (
      <div 
        key={task.id} 
        className={`border rounded-lg p-4 ${
          isExpired ? 'border-red-300 bg-red-50' : 'border-border'
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="font-semibold">{task.product?.name}</h3>
            <p className="text-sm text-muted-foreground">{task.product?.brand}</p>
            
            <div className="mt-3">
              <h4 className="font-medium">{task.market?.name}</h4>
              <p className="text-xs text-muted-foreground">
                {task.market?.neighborhood}, {task.market?.city} - {task.market?.state}
              </p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:text-right">
            <div className="flex items-center md:justify-end">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Prazo: {formattedDeadline}
              </span>
            </div>
            
            {task.status === TaskStatus.PENDING && (
              <Button 
                onClick={() => handleOpenDialog(task)}
                className="mt-2 w-full md:w-auto"
              >
                Cumprir Tarefa
              </Button>
            )}
            
            {task.status === TaskStatus.COMPLETED && (
              <>
                <p className="text-lg font-bold mt-2">
                  R$ {task.collectedPrice?.toFixed(2).replace('.', ',')}
                </p>
                {task.completionDate && (
                  <p className="text-xs text-muted-foreground">
                    Concluída em {format(new Date(task.completionDate), "dd/MM/yyyy")}
                  </p>
                )}
              </>
            )}
            
            {task.status === TaskStatus.EXPIRED && (
              <p className="text-red-500 font-medium mt-2">Tarefa expirada</p>
            )}
          </div>
        </div>
        
        {task.notes && (
          <div className="mt-3 text-sm p-2 bg-muted rounded">
            <p><span className="font-medium">Observações:</span> {task.notes}</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Minhas Tarefas</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pendentes
            {pendingTasks.length > 0 && (
              <span className="absolute top-0 right-1 -mt-1 -mr-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingTasks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="expired">
            Expiradas
            {expiredTasks.length > 0 && (
              <span className="absolute top-0 right-1 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {expiredTasks.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="pt-4">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Sem tarefas pendentes</h3>
              <p className="text-muted-foreground">
                Você não possui tarefas pendentes no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          {completedTasks.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Sem tarefas concluídas</h3>
              <p className="text-muted-foreground">
                Você ainda não concluiu nenhuma tarefa.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expired" className="pt-4">
          {expiredTasks.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Sem tarefas expiradas</h3>
              <p className="text-muted-foreground">
                Você não tem tarefas que excederam o prazo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {expiredTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completar Tarefa</DialogTitle>
            <DialogDescription>
              Informe o preço coletado para o produto {selectedTask?.product?.name} 
              no {selectedTask?.market?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço Coletado (R$)</Label>
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCompleteTask}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AuditorTasks;
