
import React from 'react';

interface AdminSidebarMenuProps {
  children: React.ReactNode;
}

export const AdminSidebarMenu = ({ children }: AdminSidebarMenuProps) => {
  return <div className="sidebar-menu">{children}</div>;
};
