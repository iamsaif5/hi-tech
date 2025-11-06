
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Factory, Users, Zap, UserCog } from 'lucide-react';
import FactoryTab from './settings/FactoryTab';
import FactorySetupTab from './settings/FactorySetupTab';
import UsersRolesTab from './settings/UsersRolesTab';
import APIIntegrationsTab from './settings/APIIntegrationsTab';
import AIAutomationTab from './settings/AIAutomationTab';
import StaffSettingsTab from './settings/StaffSettingsTab';

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('company');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full clean-tabs">
        <div className="flex items-center justify-between gap-4 py-4">
          <TabsList>
            <TabsTrigger value="company">Company Details</TabsTrigger>
            <TabsTrigger value="factory">Machines & Templates</TabsTrigger>
            <TabsTrigger value="users">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="integrations">API & Integrations</TabsTrigger>
            <TabsTrigger value="staff">Staff Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="company" className="mt-4">
          <FactoryTab />
        </TabsContent>

        <TabsContent value="factory" className="mt-4">
          <FactorySetupTab />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <UsersRolesTab />
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <APIIntegrationsTab />
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <StaffSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsView;
