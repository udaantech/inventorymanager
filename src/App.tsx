import { Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
  useRoutes,
} from "react-router-dom";
import Contact from "./pages/Contact";
import Home from "./components/home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Products from "./pages/dashboard/Products";
import Inventory from "./pages/dashboard/Inventory";
import routes from "tempo-routes";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// Separate component for Tempo routes
function TempoRoutes() {
  return useRoutes(routes);
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
      {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
    </Routes>
  );
}

function App() {
  const basename = import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <Suspense fallback={<p>Loading...</p>}>
          {import.meta.env.VITE_TEMPO && <TempoRoutes />}
          <AppRoutes />
        </Suspense>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
