
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { mockProducts, mockMarkets } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Box, Plus } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = searchTerm 
    ? mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      )
    : mockProducts;
    
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Produtos</h1>
          
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Adicionar Produto
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Produtos</CardTitle>
            <CardDescription>
              Visualize e gerencie os produtos cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, marca ou código de barras..."
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
                    <TableHead>Marca</TableHead>
                    <TableHead>Código EAN</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhum produto encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.barcode}</TableCell>
                        <TableCell>{product.categoryId}</TableCell>
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

export default AdminProducts;
