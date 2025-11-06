
import React, { useState } from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import AppSidebar from '../components/AppSidebar';
import TopBar from '../components/TopBar';
import DashboardView from '../components/DashboardView';
import ClientsView from '../components/ClientsView';
import CRMView from '../components/CRMView';
import OrdersView from '../components/OrdersView';
import StaffView from '../components/StaffView';
import OperationsView from '../components/OperationsView';
import FinanceView from '../components/FinanceView';
import ReportsView from '../components/ReportsView';
import SettingsView from '../components/SettingsView';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'clients':
        return 'Clients';
      case 'crm':
        return 'Clients';
      case 'orders':
        return 'Orders';
      case 'staff':
        return 'Staff';
      case 'operations':
        return 'Operations';
      case 'finance':
        return 'Finance';
      case 'reports':
        return 'Reporting';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'clients':
        return <ClientsView />;
      case 'crm':
        return <CRMView />;
      case 'orders':
        return <OrdersView />;
      case 'staff':
        return <StaffView />;
      case 'operations':
        return <OperationsView />;
      case 'finance':
        return <FinanceView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col">
          <TopBar currentPage={getPageTitle()} />
          <main className="flex-1 bg-white overflow-auto">
            <div className="p-4">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
