
import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebarContent } from "./admin/layout/AdminSidebarContent";
import { AdminHeader } from "./admin/layout/AdminHeader";
import { useViewportDetection } from "./admin/layout/useViewportDetection";

const AdminLayout = () => {
  const { isMobileView } = useViewportDetection();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
        <Sidebar variant="floating" className="shadow-md">
          <AdminSidebarContent />
        </Sidebar>

        <SidebarInset className="pt-16 md:pt-0">
          <AdminHeader isMobileView={isMobileView} />
          <div className="container py-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
