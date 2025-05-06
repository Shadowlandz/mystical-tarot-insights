
import React from 'react';

interface AdminSidebarMenuProps {
  children: React.ReactNode;
}

export const AdminSidebarMenu: React.FC<AdminSidebarMenuProps> = ({ children }) => {
  return <div className="sidebar-menu">{children}</div>;
};
