import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TarotPage from "./pages/TarotPage";
import AcervoPage from "./pages/AcervoPage";
import SobrePage from "./pages/SobrePage";
import NotFound from "./pages/NotFound";
import VideoViewPage from "./pages/VideoViewPage";
import ContentViewPage from "./pages/ContentViewPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SpiritualRoutinesPage from "./pages/SpiritualRoutinesPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import { AuthCheck } from "./components/AuthCheck";

// Import missing admin components
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAcervoPage from "./pages/AdminAcervoPage";
import AdminVideosPage from "./pages/AdminVideosPage";
import AdminArticlesPage from "./pages/AdminArticlesPage";
import AdminGeminiPage from "./pages/AdminGeminiPage";
import AdminSecurityPage from "./pages/AdminSecurityPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Rotas do site público */}
          <Route path="/" element={<Index />} />
          <Route path="/tarot" element={<TarotPage />} />
          <Route path="/acervo" element={<AcervoPage />} />
          <Route path="/acervo/video/:id" element={<VideoViewPage />} />
          <Route path="/acervo/content/:id" element={<ContentViewPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          
          {/* Autenticação */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Rotas protegidas por autenticação */}
          <Route path="/profile" element={
            <AuthCheck>
              <ProfilePage />
            </AuthCheck>
          } />
          <Route path="/routines" element={
            <AuthCheck>
              <SpiritualRoutinesPage />
            </AuthCheck>
          } />
          
          {/* Rotas administrativas */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="acervo" element={<AdminAcervoPage />} />
            <Route path="videos" element={<AdminVideosPage />} />
            <Route path="artigos" element={<AdminArticlesPage />} />
            <Route path="gemini" element={<AdminGeminiPage />} />
            <Route path="seguranca" element={<AdminSecurityPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            {/* Adicione mais rotas administrativas aqui */}
          </Route>
          
          {/* Rota curinga para páginas não encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
