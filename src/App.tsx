
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserRole } from "./types";
import { useState } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import PublicPrices from "./pages/PublicPrices";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminMarkets from "./pages/admin/AdminMarkets";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminUsers from "./pages/admin/AdminUsers";
import AuditorTasks from "./pages/auditor/AuditorTasks";
import AuditorCollect from "./pages/auditor/AuditorCollect";
import ContributorCollect from "./pages/contributor/ContributorCollect";
import NotFoundPage from "./components/NotFoundPage";

const App = () => {
  // Create a new query client instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/prices" element={<PublicPrices />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/markets"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminMarkets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tasks"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminTasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              
              {/* Auditor Routes */}
              <Route
                path="/auditor/tasks"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.AUDITOR]}>
                    <AuditorTasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auditor/collect"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.AUDITOR]}>
                    <AuditorCollect />
                  </ProtectedRoute>
                }
              />
              
              {/* Contributor Routes */}
              <Route
                path="/contributor/collect"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.CONTRIBUTOR]}>
                    <ContributorCollect />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
