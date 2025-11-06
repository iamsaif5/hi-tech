import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Clock, 
  User, 
  Package, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Edit,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface ManufacturingOrder {
  id: string;
  mo_number: string;
  order_id: string;
  client_id: string;
  product: string;
  quantity: number;
  due_date: string;
  status: 'In Queue' | 'Scheduled' | 'In Production' | 'Completed' | 'On Hold';
  scheduled_date?: string;
  scheduled_start_date?: string;
  scheduled_end_date?: string;
  assigned_operator?: string;
  assigned_machine?: string;
  department?: string;
  duration?: string;
  clients?: {
    name: string;
  };
}

const ProductionCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedMO, setSelectedMO] = useState<ManufacturingOrder | null>(null);
  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedMO, setDraggedMO] = useState<ManufacturingOrder | null>(null);

  // Fetch manufacturing orders from database
  useEffect(() => {
    const fetchManufacturingOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('manufacturing_orders')
          .select(`
            *,
            clients (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setManufacturingOrders(data || []);
      } catch (error) {
        console.error('Error fetching manufacturing orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManufacturingOrders();
  }, []);

  const unscheduledMOs = manufacturingOrders.filter(mo => 
    mo.status === 'In Queue' || (mo.status === 'Scheduled' && !mo.scheduled_start_date)
  );
  
  const scheduledMOs = manufacturingOrders.filter(mo => 
    mo.scheduled_start_date && mo.status === 'Scheduled'
  );

  // Fix any inconsistent data - if MO is "Scheduled" but has no date, it should be "In Queue"
  React.useEffect(() => {
    const inconsistentMOs = manufacturingOrders.filter(mo => 
      mo.status === 'Scheduled' && !mo.scheduled_start_date
    );
    
    if (inconsistentMOs.length > 0) {
      console.log('Found MOs with Scheduled status but no scheduled_start_date:', inconsistentMOs);
      // Auto-fix by updating status to "In Queue" for these MOs
      inconsistentMOs.forEach(async (mo) => {
        try {
          await supabase
            .from('manufacturing_orders')
            .update({ status: 'In Queue' })
            .eq('id', mo.id);
        } catch (error) {
          console.error('Error fixing MO status:', error);
        }
      });
    }
  }, [manufacturingOrders]);

  const getDateRange = () => {
    switch (viewMode) {
      case 'day':
        return [currentDate];
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return eachDayOfInterval({ start: monthStart, end: monthEnd });
      default:
        return [currentDate];
    }
  };

  const getMOsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return scheduledMOs.filter(mo => mo.scheduled_start_date === dateStr);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, mo: ManufacturingOrder) => {
    setDraggedMO(mo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    if (!draggedMO) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      const { error } = await supabase
        .from('manufacturing_orders')
        .update({ 
          scheduled_start_date: dateStr,
          status: 'Scheduled'
        })
        .eq('id', draggedMO.id);

      if (error) throw error;

      // Update local state
      setManufacturingOrders(prev => 
        prev.map(mo => 
          mo.id === draggedMO.id 
            ? { ...mo, scheduled_start_date: dateStr, status: 'Scheduled' as const }
            : mo
        )
      );
    } catch (error) {
      console.error('Error scheduling MO:', error);
    } finally {
      setDraggedMO(null);
    }
  };

  // Handle dropping on unscheduled area to move back to queue
  const handleDropToQueue = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedMO) return;

    try {
      const { error } = await supabase
        .from('manufacturing_orders')
        .update({ 
          scheduled_start_date: null,
          status: 'In Queue'
        })
        .eq('id', draggedMO.id);

      if (error) throw error;

      // Update local state
      setManufacturingOrders(prev => 
        prev.map(mo => 
          mo.id === draggedMO.id 
            ? { ...mo, scheduled_start_date: null, status: 'In Queue' as const }
            : mo
        )
      );
    } catch (error) {
      console.error('Error moving MO back to queue:', error);
    } finally {
      setDraggedMO(null);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const days = viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30;
    setCurrentDate(prev => addDays(prev, direction === 'next' ? days : -days));
  };

  return (
    <div className="flex h-[800px] gap-4">
      {/* Left Panel - Unscheduled MOs */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-card rounded-lg border h-full flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold">Orders Ready for Scheduling</h3>
            <p className="text-xs text-muted-foreground mt-1">
              In Queue orders ready to be scheduled
            </p>
            {unscheduledMOs.length > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                {unscheduledMOs.length} order(s) awaiting calendar assignment
              </p>
            )}
          </div>
          <div 
            className="flex-1 p-4 space-y-3 overflow-y-auto"
            onDragOver={handleDragOver}
            onDrop={handleDropToQueue}
          >
            {unscheduledMOs.map((mo) => (
              <div 
                key={mo.id} 
                className={`bg-card rounded-lg border p-3 cursor-move hover:shadow-sm transition-shadow ${
                  mo.status === 'In Queue' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, mo)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary hover:text-primary/80 cursor-pointer">
                      {mo.mo_number}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        mo.status === 'In Queue' ? 'bg-orange-500' :
                        mo.status === 'Scheduled' && !mo.scheduled_start_date ? 'bg-yellow-500' :
                        mo.status === 'Scheduled' ? 'bg-blue-500' :
                        mo.status === 'In Production' ? 'bg-green-500' :
                        mo.status === 'Completed' ? 'bg-green-600' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-xs font-medium text-foreground">
                        {mo.status === 'Scheduled' && !mo.scheduled_start_date ? 'Needs Date' : mo.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground">{mo.clients?.name || 'Unknown Client'}</p>
                  <p className="text-xs text-foreground truncate" title={mo.product}>
                    {mo.product}
                  </p>
                  <p className="text-xs text-foreground">{mo.quantity.toLocaleString()} units</p>
                  <p className="text-xs text-muted-foreground">Due: {mo.due_date}</p>
                </div>
              </div>
            ))}
            {unscheduledMOs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">All orders scheduled</p>
                <p className="text-xs mt-1">Drag orders to calendar dates</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Vertical Calendar */}
      <div className="flex-1">
        <div className="bg-card rounded-lg border h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-sm font-semibold">
                {viewMode === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
                {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`}
                {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'day' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
              <Button 
                variant={viewMode === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button 
                variant={viewMode === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {getDateRange().map((date, index) => {
                const mosForDate = getMOsForDate(date);
                
                return (
                  <div
                    key={index}
                    className="flex border rounded-lg min-h-16 hover:bg-muted/30 transition-colors"
                  >
                    {/* Date Column */}
                    <div className="w-24 flex-shrink-0 p-3 border-r bg-muted/10 flex flex-col justify-center">
                      <div className="text-xs font-medium text-center">
                        {format(date, 'EEE')}
                      </div>
                      <div className="text-sm font-semibold text-center">
                        {format(date, 'd')}
                      </div>
                    </div>
                    
                    {/* Drop Area */}
                    <div 
                      className="flex-1 p-3"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, date)}
                    >
                      {mosForDate.length > 0 ? (
                        <ScrollArea className="w-full">
                          <div className="flex gap-2 pb-2">
                            {mosForDate.map((mo) => (
                              <div
                                key={mo.id}
                                className="min-w-48 bg-primary text-primary-foreground rounded px-3 py-2 text-xs cursor-move hover:opacity-80 flex-shrink-0"
                                draggable
                                onDragStart={(e) => handleDragStart(e, mo)}
                                onClick={() => setSelectedMO(mo)}
                              >
                                <div className="space-y-1">
                                  <div className="font-medium">{mo.mo_number}</div>
                                  <div className="text-primary-foreground/80">{mo.clients?.name || 'Unknown Client'}</div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-primary-foreground/60 text-[10px]">{mo.duration || '4h'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div 
                          className={`text-xs h-full flex items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
                            draggedMO ? 'border-primary text-primary bg-primary/10' : 'border-muted-foreground/30 text-muted-foreground'
                          }`}
                        >
                          Drop MO here to schedule
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionCalendar;