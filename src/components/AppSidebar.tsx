
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  ShoppingCart, 
  Factory, 
  Shield, 
  Package, 
  Users, 
  TrendingUp, 
  Settings,
  Building
} from 'lucide-react';

const AppSidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'crm', label: 'Clients', icon: Building },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'operations', label: 'Operations', icon: Factory },
    { id: 'finance', label: 'Finance', icon: TrendingUp },
    { id: 'reports', label: 'Reporting', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar w-64">
      <SidebarContent>
        <div className="p-4 flex justify-center">
          <img src="/lovable-uploads/1a80eea5-dc8d-4381-8ecd-105c4cd7f9ab.png" alt="Hitec Packaging" className="h-12 w-auto" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent className="px-4 py-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    className={`w-full justify-start py-3 px-4 rounded-lg transition-all duration-200 ${
                      activeView === item.id
                        ? 'bg-white text-sidebar hover:bg-white hover:text-sidebar'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
