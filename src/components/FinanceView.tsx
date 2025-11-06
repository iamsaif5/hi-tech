
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceQueueTab } from './finance/InvoiceQueueTab';
import { ReceivablesTab } from './finance/ReceivablesTab';
import { PayablesExpensesTab } from './finance/PayablesExpensesTab';
import { CashManagerTab } from './finance/CashManagerTab';
import { IntegrationsTab } from './finance/IntegrationsTab';

const FinanceView = () => {
  const [activeTab, setActiveTab] = useState('invoice-queue');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full clean-tabs">
        <TabsList>
          <TabsTrigger value="invoice-queue">Invoice Queue</TabsTrigger>
          <TabsTrigger value="receivables">Receivables</TabsTrigger>
          <TabsTrigger value="payables-expenses">Payables & Expenses</TabsTrigger>
          <TabsTrigger value="cash-manager">Cash Manager</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice-queue" className="mt-4">
          <InvoiceQueueTab />
        </TabsContent>

        <TabsContent value="receivables" className="mt-4">
          <ReceivablesTab />
        </TabsContent>

        <TabsContent value="payables-expenses" className="mt-4">
          <PayablesExpensesTab />
        </TabsContent>

        <TabsContent value="cash-manager" className="mt-4">
          <CashManagerTab />
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <IntegrationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceView;
