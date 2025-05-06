
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "@/components/admin/layout/AdminSidebarContent";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden md:block">
        <AdminSidebarContent />
      </Sidebar>
      
      <div className="flex-1 p-8 md:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
