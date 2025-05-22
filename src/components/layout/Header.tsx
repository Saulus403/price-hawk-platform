
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">PriceMonitor</Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-4">
              {currentUser?.role === UserRole.ADMIN && (
                <>
                  <Link to="/admin/dashboard" className="hover:text-white/80">Dashboard</Link>
                  <Link to="/admin/products" className="hover:text-white/80">Produtos</Link>
                  <Link to="/admin/markets" className="hover:text-white/80">Mercados</Link>
                  <Link to="/admin/tasks" className="hover:text-white/80">Tarefas</Link>
                  <Link to="/admin/users" className="hover:text-white/80">Usuários</Link>
                </>
              )}
              
              {currentUser?.role === UserRole.AUDITOR && (
                <>
                  <Link to="/auditor/tasks" className="hover:text-white/80">Minhas Tarefas</Link>
                  <Link to="/auditor/collect" className="hover:text-white/80">Coletar Preços</Link>
                </>
              )}
              
              {currentUser?.role === UserRole.CONTRIBUTOR && (
                <Link to="/contributor/collect" className="hover:text-white/80">Coletar Preços</Link>
              )}
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline-block">
                {currentUser?.name} ({currentUser?.role})
              </span>
              <Button variant="secondary" onClick={handleLogout}>Sair</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="secondary" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button variant="outline" className="bg-white/10" asChild>
                <Link to="/prices">Consultar Preços</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
