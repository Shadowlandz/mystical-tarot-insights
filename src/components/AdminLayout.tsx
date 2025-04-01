
import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Library, 
  FileText, 
  Video, 
  Activity, 
  LogOut, 
  Menu, 
  ChevronLeft,
  Settings,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo",
    });
    navigate("/admin/login");
  };

  const menuItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Acervo", path: "/admin/acervo", icon: Library },
    { title: "Artigos", path: "/admin/artigos", icon: FileText },
    { title: "Vídeos", path: "/admin/videos", icon: Video },
    { title: "Analytics", path: "/admin/analytics", icon: Activity },
    { title: "Segurança", path: "/admin/seguranca", icon: Shield },
    { title: "Configurações", path: "/admin/configuracoes", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
        <Sidebar variant="floating" className="shadow-md">
          <SidebarHeader className="border-b border-border/50">
            <div className="flex items-center gap-2 py-3">
              <div className="shrink-0 rounded-md bg-primary/10 p-1">
                <ChevronLeft className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 text-lg font-semibold">Admin Portal</div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        active={location.pathname === item.path}
                      >
                        <Link to={item.path}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-border/50">
            <div className="p-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="pt-16 md:pt-0">
          <div className="flex h-16 items-center gap-4 border-b border-border/40 px-4 md:px-6">
            <div className="flex items-center">
              <SidebarTrigger />
              {isMobileView && (
                <Link to="/" className="ml-4 text-2xl font-mystical text-primary">
                  Tarot Místico
                </Link>
              )}
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Voltar ao Site
              </Link>
            </div>
          </div>

          <div className="container py-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
