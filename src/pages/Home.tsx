
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import Layout from '@/components/layout/Layout';

const Home = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their respective dashboards
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      switch(currentUser.role) {
        case UserRole.ADMIN:
          navigate('/admin/dashboard');
          break;
        case UserRole.AUDITOR:
          navigate('/auditor/tasks');
          break;
        case UserRole.CONTRIBUTOR:
          navigate('/contributor/collect');
          break;
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-14rem)] flex flex-col justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Monitoramento de Preços<br />
            <span className="text-primary">Simples e Eficiente</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Acompanhe preços de produtos em diferentes mercados, delegue tarefas 
            para sua equipe e receba colaborações.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            {!isAuthenticated && (
              <Button size="lg" asChild>
                <Link to="/login">Acessar o Sistema</Link>
              </Button>
            )}
            
            <Button size="lg" variant="outline" asChild>
              <Link to="/prices">Consultar Preços</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Para Empresas</h3>
              <p className="text-muted-foreground">
                Gerencie sua equipe de auditores, delegue tarefas
                e monitore preços em tempo real.
              </p>
            </div>
            
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Para Auditores</h3>
              <p className="text-muted-foreground">
                Receba tarefas, colete preços e mantenha
                registros organizados de suas verificações.
              </p>
            </div>
            
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Para Colaboradores</h3>
              <p className="text-muted-foreground">
                Contribua com informações de preços 
                de maneira rápida e fácil.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
