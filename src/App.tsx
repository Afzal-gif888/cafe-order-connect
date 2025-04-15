import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CafeProvider } from "./context/CafeContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import CafeteriaDashboard from "./pages/CafeteriaDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Role-specific route component
const RoleRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Main dashboard router based on user role
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  switch (user.role) {
    case 'client':
      return <ClientDashboard />;
    case 'cafeteria':
      return <CafeteriaDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <NotFound />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CafeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
              
              {/* Client routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['client']}>
                    <Cart />
                  </RoleRoute>
                </ProtectedRoute>
              } />
              
              {/* Common protected routes */}
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CafeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
