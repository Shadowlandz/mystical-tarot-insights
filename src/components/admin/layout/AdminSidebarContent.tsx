
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

export function AdminSidebarContent() {
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
    <>
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
            <AdminSidebarMenu />
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
    </>
  );
}
