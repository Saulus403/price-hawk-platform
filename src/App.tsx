
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserRole } from "./types";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import PublicPrices from "./pages/PublicPrices";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuditorTasks from "./pages/auditor/AuditorTasks";
import ContributorCollect from "./pages/contributor/ContributorCollect";
import NotFoundPage from "./components/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
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
            
            {/* Auditor Routes */}
            <Route
              path="/auditor/tasks"
              element={
                <ProtectedRoute allowedRoles={[UserRole.AUDITOR]}>
                  <AuditorTasks />
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

export default App;
