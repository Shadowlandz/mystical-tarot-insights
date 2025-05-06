import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { AdminSidebarMenu } from "./AdminSidebarMenu";
import { BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Folder, Video, FileText } from "lucide-react";

export const AdminSidebarContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo",
    });
    navigate("/admin/login");
  };

  return (
    <div className="flex h-full flex-col gap-2">
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
            <AdminSidebarMenu>
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Gerenciamento
                </h2>
                <div className="space-y-1">
                  <Link to="/admin/dashboard">
                    <Button
                      variant={location.pathname === "/admin/dashboard" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/admin/analytics">
                    <Button
                      variant={location.pathname === "/admin/analytics" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </Link>
                  <Link to="/admin/acervo">
                    <Button
                      variant={location.pathname === "/admin/acervo" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      Acervo
                    </Button>
                  </Link>
                  <Link to="/admin/videos">
                    <Button
                      variant={location.pathname === "/admin/videos" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Vídeos
                    </Button>
                  </Link>
                  <Link to="/admin/artigos">
                    <Button
                      variant={location.pathname === "/admin/artigos" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Artigos
                    </Button>
                  </Link>
                </div>
              </div>
            </AdminSidebarMenu>
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
    </div>
  );
};
