
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tarot" element={<TarotPage />} />
          <Route path="/acervo" element={<AcervoPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          {/* ADICIONE TODAS AS ROTAS PERSONALIZADAS ACIMA DA ROTA CURINGA "*" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
