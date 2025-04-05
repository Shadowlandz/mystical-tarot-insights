
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Library, 
  FileText, 
  Video, 
  Activity, 
  Settings,
  Shield
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export interface MenuItem {
  title: string;
  path: string;
  icon: React.FC<{ className?: string }>;
}

export const menuItems: MenuItem[] = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Acervo", path: "/admin/acervo", icon: Library },
  { title: "Artigos", path: "/admin/artigos", icon: FileText },
  { title: "Vídeos", path: "/admin/videos", icon: Video },
  { title: "Analytics", path: "/admin/analytics", icon: Activity },
  { title: "Segurança", path: "/admin/seguranca", icon: Shield },
  { title: "Configurações", path: "/admin/configuracoes", icon: Settings },
];

export function AdminSidebarMenu() {
  const location = useLocation();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton 
            asChild 
            tooltip={item.title}
            isActive={location.pathname === item.path}
          >
            <Link to={item.path}>
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
