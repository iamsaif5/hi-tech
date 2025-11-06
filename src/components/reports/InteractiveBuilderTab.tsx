import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import { 
  DollarSign, 
  Users, 
  Factory, 
  Shield,
  Plus,
  X,
  Save,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Columns,
  Star
} from 'lucide-react';

interface Field {
  id: string;
  name: string;
  type: 'dimension' | 'metric';
  category: string;
}

interface BuilderState {
  rows: Field[];
  columns: Field[];
  metrics: Field[];
  filters: any[];
  chartType: string;
}

export const InteractiveBuilderTab = () => {
  const [builderState, setBuilderState] = useState<BuilderState>({
    rows: [],
    columns: [],
    metrics: [],
    filters: [],
    chartType: 'table'
  });
  
  const [reportName, setReportName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Available fields by category
  const fieldCategories: Record<string, Field[]> = {
    Finance: [
      { id: 'revenue', name: 'Revenue', type: 'metric', category: 'Finance' },
      { id: 'gross_margin', name: 'Gross Margin %', type: 'metric', category: 'Finance' },
      { id: 'client_name', name: 'Client Name', type: 'dimension', category: 'Finance' },
      { id: 'invoice_date', name: 'Invoice Date', type: 'dimension', category: 'Finance' },
      { id: 'payment_status', name: 'Payment Status', type: 'dimension', category: 'Finance' }
    ],
    Production: [
      { id: 'oee', name: 'OEE %', type: 'metric', category: 'Production' },
      { id: 'efficiency', name: 'Efficiency %', type: 'metric', category: 'Production' },
      { id: 'machine_name', name: 'Machine Name', type: 'dimension', category: 'Production' },
      { id: 'shift', name: 'Shift', type: 'dimension', category: 'Production' },
      { id: 'production_date', name: 'Production Date', type: 'dimension', category: 'Production' }
    ],
    QC: [
      { id: 'pass_rate', name: 'Pass Rate %', type: 'metric', category: 'QC' },
      { id: 'waste_percentage', name: 'Waste %', type: 'metric', category: 'QC' },
      { id: 'defect_type', name: 'Defect Type', type: 'dimension', category: 'QC' },
      { id: 'test_date', name: 'Test Date', type: 'dimension', category: 'QC' },
      { id: 'product_type', name: 'Product Type', type: 'dimension', category: 'QC' }
    ],
    Staff: [
      { id: 'attendance_rate', name: 'Attendance %', type: 'metric', category: 'Staff' },
      { id: 'overtime_hours', name: 'Overtime Hours', type: 'metric', category: 'Staff' },
      { id: 'employee_name', name: 'Employee Name', type: 'dimension', category: 'Staff' },
      { id: 'department', name: 'Department', type: 'dimension', category: 'Staff' },
      { id: 'hire_date', name: 'Hire Date', type: 'dimension', category: 'Staff' }
    ]
  };

  // Mock preview data
  const getPreviewData = () => {
    const sampleData = [
      { client: 'Lion Group', revenue: 875000, margin: 24.5, month: 'Jan 2024' },
      { client: 'Tiger Brands', revenue: 623000, margin: 22.1, month: 'Jan 2024' },
      { client: 'Freedom Foods', revenue: 445000, margin: 26.3, month: 'Jan 2024' },
      { client: 'Pioneer Foods', revenue: 387000, margin: 21.8, month: 'Jan 2024' }
    ];

    if (builderState.rows.length === 0 && builderState.columns.length === 0 && builderState.metrics.length === 0) {
      return [];
    }

    return sampleData;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Handle drag from fields to builder areas
    if (source.droppableId === 'fields') {
      const field = Object.values(fieldCategories)
        .flat()
        .find(f => f.id === result.draggableId);
      
      if (!field) return;

      const newState = { ...builderState };
      
      if (destination.droppableId === 'rows') {
        newState.rows = [...newState.rows, field];
      } else if (destination.droppableId === 'columns') {
        newState.columns = [...newState.columns, field];
      } else if (destination.droppableId === 'metrics') {
        newState.metrics = [...newState.metrics, field];
      }
      
      setBuilderState(newState);
    }
  };

  const removeField = (area: 'rows' | 'columns' | 'metrics', index: number) => {
    const newState = { ...builderState };
    newState[area].splice(index, 1);
    setBuilderState(newState);
  };

  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      field: '',
      operator: 'equals',
      value: ''
    };
    setBuilderState({
      ...builderState,
      filters: [...builderState.filters, newFilter]
    });
  };

  const removeFilter = (index: number) => {
    const newFilters = [...builderState.filters];
    newFilters.splice(index, 1);
    setBuilderState({ ...builderState, filters: newFilters });
  };

  const saveReport = () => {
    // In a real implementation, this would save to Supabase
    console.log('Saving report:', { name: reportName, config: builderState });
    setShowSaveDialog(false);
    setReportName('');
  };

  const exportReport = () => {
    // In a real implementation, this would export the data
    console.log('Exporting report');
  };

  const previewData = getPreviewData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Left Sidebar - Field Selection */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Fields</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Accordion type="multiple" defaultValue={Object.keys(fieldCategories)}>
                      {Object.entries(fieldCategories).map(([category, fields]) => (
                        <AccordionItem key={category} value={category}>
                          <AccordionTrigger className="text-sm">
                            <div className="flex items-center gap-2">
                              {category === 'Finance' && <DollarSign className="h-4 w-4" />}
                              {category === 'Production' && <Factory className="h-4 w-4" />}
                              {category === 'QC' && <Shield className="h-4 w-4" />}
                              {category === 'Staff' && <Users className="h-4 w-4" />}
                              {category}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {fields.map((field, index) => (
                                <Draggable key={field.id} draggableId={field.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="p-2 bg-muted rounded-lg cursor-grab hover:bg-muted/80 transition-colors"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium">{field.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {field.type}
                                        </Badge>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Builder and Preview */}
      <div className="lg:col-span-2 space-y-4 overflow-y-auto">
        {/* Builder Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rows */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rows</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="rows">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[100px] space-y-2"
                    >
                      {builderState.rows.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-100 rounded">
                          <span className="text-xs font-medium">{field.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField('rows', index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>

          {/* Columns */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Columns</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="columns">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[100px] space-y-2"
                    >
                      {builderState.columns.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-100 rounded">
                          <span className="text-xs font-medium">{field.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField('columns', index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="metrics">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[100px] space-y-2"
                    >
                      {builderState.metrics.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-amber-100 rounded">
                          <span className="text-xs font-medium">{field.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField('metrics', index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select 
                  value={builderState.chartType} 
                  onValueChange={(value) => setBuilderState({ ...builderState, chartType: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={addFilter}>
                  <Filter className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={exportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Add to Favourites
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {previewData.length > 0 ? (
              builderState.chartType === 'table' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Margin %</TableHead>
                      <TableHead>Month</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.client}</TableCell>
                        <TableCell>R{row.revenue.toLocaleString()}</TableCell>
                        <TableCell>{row.margin}%</TableCell>
                        <TableCell>{row.month}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {builderState.chartType.charAt(0).toUpperCase() + builderState.chartType.slice(1)} chart preview
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <Columns className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag fields from the left to see a preview
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Dialog */}
        {showSaveDialog && (
          <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="w-96 p-6 bg-background border rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Save Report</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Enter report name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveReport} disabled={!reportName.trim()}>
                    Save Report
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};