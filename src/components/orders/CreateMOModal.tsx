import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateMOModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onMOCreated: () => void;
}

const CreateMOModal = ({ isOpen, onClose, order, onMOCreated }: CreateMOModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    artworkFile: null as File | null,
    artworkUrl: '',
    printSpecs: '',
    materialDetails: '',
    packagingRequirements: '',
    deliveryTargetDate: undefined as Date | undefined,
    internalApproval: 'Pending'
  });

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${order.order_number}-artwork-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      setFormData(prev => ({ 
        ...prev, 
        artworkFile: file,
        artworkUrl: publicUrl 
      }));

      toast({
        title: "Success",
        description: "Artwork uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload artwork",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    const requiredFields = [
      { field: formData.artworkUrl, name: 'Artwork' },
      { field: formData.printSpecs, name: 'Print Specs' },
      { field: formData.materialDetails, name: 'Material Details' },
      { field: formData.internalApproval, name: 'Internal Approval' }
    ];

    const missingFields = requiredFields.filter(item => !item.field.trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please complete: ${missingFields.map(f => f.name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Generate MO number
      const { data: moNumber } = await supabase.rpc('generate_mo_number');

      // Create manufacturing order
      const moData = {
        mo_number: moNumber,
        order_id: order.id,
        client_id: order.client_id,
        product: order.product,
        quantity: order.quantity,
        due_date: order.delivery_date,
        delivery_target_date: formData.deliveryTargetDate ? format(formData.deliveryTargetDate, 'yyyy-MM-dd') : null,
        artwork_url: formData.artworkUrl,
        print_specs: formData.printSpecs,
        material_details: formData.materialDetails,
        packaging_requirements: formData.packagingRequirements,
        internal_approval: formData.internalApproval,
        status: 'In Queue' as const
      };

      const { error } = await supabase
        .from('manufacturing_orders')
        .insert(moData);

      if (error) throw error;

      // Update order status to confirmed
      await supabase
        .from('orders')
        .update({ status: 'Confirmed' })
        .eq('id', order.id);

      toast({
        title: "Success",
        description: `Manufacturing Order ${moNumber} created successfully`,
      });

      onMOCreated();
      onClose();
    } catch (error) {
      console.error('Error creating MO:', error);
      toast({
        title: "Error",
        description: "Failed to create Manufacturing Order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.artworkUrl && formData.printSpecs && formData.materialDetails && formData.internalApproval;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create Manufacturing Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Read-only Order Information */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">Order Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium">Order ID</Label>
                <p className="text-foreground">{order.order_number}</p>
              </div>
              <div>
                <Label className="text-xs font-medium">Client Name</Label>
                <p className="text-foreground">{order.clients?.name}</p>
              </div>
              <div>
                <Label className="text-xs font-medium">Product</Label>
                <p className="text-foreground">{order.product}</p>
              </div>
              <div>
                <Label className="text-xs font-medium">Quantity</Label>
                <p className="text-foreground">{order.quantity.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Required Fields */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Manufacturing Details</h3>
            
            {/* Artwork Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Artwork Upload *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {formData.artworkFile ? (
                  <div className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm truncate">{formData.artworkFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, artworkFile: null, artworkUrl: '' }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Upload artwork file</p>
                    <p className="text-xs text-muted-foreground mb-3">PDF, PNG, AI files accepted</p>
                    <input
                      type="file"
                      accept=".pdf,.png,.ai,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                      id="artwork-upload"
                      disabled={uploadingFile}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('artwork-upload')?.click()}
                      disabled={uploadingFile}
                    >
                      {uploadingFile ? 'Uploading...' : 'Choose File'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Print Specs */}
            <div className="space-y-2">
              <Label htmlFor="printSpecs" className="text-sm font-medium">Print Specifications *</Label>
              <Textarea
                id="printSpecs"
                placeholder="Enter detailed print specifications..."
                value={formData.printSpecs}
                onChange={(e) => setFormData(prev => ({ ...prev, printSpecs: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Material Details */}
            <div className="space-y-2">
              <Label htmlFor="materialDetails" className="text-sm font-medium">Material Details *</Label>
              <Select value={formData.materialDetails} onValueChange={(value) => setFormData(prev => ({ ...prev, materialDetails: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PP Woven">PP Woven</SelectItem>
                  <SelectItem value="HDPE">HDPE</SelectItem>
                  <SelectItem value="LDPE">LDPE</SelectItem>
                  <SelectItem value="Jute">Jute</SelectItem>
                  <SelectItem value="Cotton">Cotton</SelectItem>
                  <SelectItem value="Custom">Custom Material</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Packaging Requirements */}
            <div className="space-y-2">
              <Label htmlFor="packaging" className="text-sm font-medium">Packaging Requirements</Label>
              <Textarea
                id="packaging"
                placeholder="Enter packaging requirements (optional)"
                value={formData.packagingRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, packagingRequirements: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Delivery Target Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Delivery Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deliveryTargetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deliveryTargetDate ? format(formData.deliveryTargetDate, "PPP") : "Select target date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deliveryTargetDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, deliveryTargetDate: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Internal Approval */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Internal Approval *</Label>
              <Select value={formData.internalApproval} onValueChange={(value) => setFormData(prev => ({ ...prev, internalApproval: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Creating MO...' : 'Confirm MO'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMOModal;