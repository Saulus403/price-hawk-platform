
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { mockUsers, mockCompanies } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, Plus } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  let filteredUsers = [...mockUsers];
  
  // Filter by role
  if (filterRole !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.role === filterRole);
  }
  
  // Filter by search term
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Administrador</Badge>;
      case UserRole.AUDITOR:
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Auditor</Badge>;
      case UserRole.CONTRIBUTOR:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Alimentador</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
    
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Usuários</h1>
          
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Adicionar Usuário
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>
              Visualize e gerencie os usuários cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os perfis</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Administradores</SelectItem>
                  <SelectItem value={UserRole.AUDITOR}>Auditores</SelectItem>
                  <SelectItem value={UserRole.CONTRIBUTOR}>Alimentadores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map(user => {
                      const company = mockCompanies.find(c => c.id === user.companyId);
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{company?.name}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2">
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm">
                              Excluir
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

export default AdminUsers;
