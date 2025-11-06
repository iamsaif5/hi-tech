
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { useClients, Client } from '@/hooks/useClients';

interface CRMClientListProps {
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
}

const CRMClientList = ({ onSelectClient, onAddClient }: CRMClientListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const { clients, loading } = useClients();

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesType = typeFilter === 'all' || client.client_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Paused': return 'bg-yellow-500';
      case 'Blacklisted': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600';
      case 'Paused': return 'text-yellow-600';
      case 'Blacklisted': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleRowClick = (client: Client) => {
    onSelectClient(client);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading clients...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Clients Management Header */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Client Management</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search clients, contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-10 w-48 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Blacklisted">Blacklisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 h-10 text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Distributor">Distributor</SelectItem>
                <SelectItem value="Retailer">Retailer</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Food Service">Food Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={onAddClient} className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Client Name</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Account Manager</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Total Orders</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Outstanding Balance</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Last Order</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  className="border-b border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleRowClick(client)}
                >
                  <td className="py-2 px-3">
                    <div>
                      <span className="text-xs font-medium text-hitec-primary hover:text-hitec-primary/80">
                        {client.name}
                      </span>
                      <div className="text-xs text-muted-foreground">{client.client_type}</div>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div>
                      <span className="text-xs font-medium text-foreground">{client.account_manager}</span>
                      <div className="text-xs text-muted-foreground">{client.contact_person}</div>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-foreground">{client.total_orders}</td>
                  <td className="py-2 px-3 text-xs text-foreground">R{client.outstanding_balance?.toLocaleString()}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{client.last_order_date}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(client.status)}`}></div>
                      <span className={`${getStatusTextColor(client.status)} text-xs font-medium`}>
                        {client.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CRMClientList;
