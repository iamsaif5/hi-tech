import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Phone, 
  RefreshCw, 
  AlertTriangle, 
  Clock,
  Users,
  Wifi,
  WifiOff
} from 'lucide-react';

interface FactoryStatusHeaderProps {
  onEmergencyStop: () => void;
  onCallSupervisor: () => void;
  onRefreshData: () => void;
  onToggleMobileMode?: () => void;
}

const FactoryStatusHeader: React.FC<FactoryStatusHeaderProps> = ({
  onEmergencyStop,
  onCallSupervisor,
  onRefreshData,
  onToggleMobileMode
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wsConnected, setWsConnected] = useState(true);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [emergencyConfirm, setEmergencyConfirm] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate WebSocket connection status
  useEffect(() => {
    const connectionTimer = setInterval(() => {
      // Simulate occasional disconnection for demo
      if (Math.random() < 0.02) { // 2% chance per second
        setWsConnected(false);
        setIsReconnecting(true);
        setTimeout(() => {
          setWsConnected(true);
          setIsReconnecting(false);
        }, 3000);
      }
    }, 1000);

    return () => clearInterval(connectionTimer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCurrentShift = () => {
    const hour = currentTime.getHours();
    return hour >= 6 && hour < 18 ? 'Day' : 'Night';
  };

  const getFactoryStatusColor = () => {
    if (!wsConnected && !isReconnecting) return 'bg-red-500';
    if (isReconnecting) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getFactoryStatusText = () => {
    if (!wsConnected && !isReconnecting) return 'Factory Offline';
    if (isReconnecting) return 'Reconnecting...';
    return 'Factory Online';
  };

  const handleEmergencyStop = () => {
    if (emergencyConfirm.toUpperCase() === 'STOP') {
      setShowEmergencyDialog(false);
      setEmergencyConfirm('');
      onEmergencyStop();
    }
  };

  const handleCallSupervisor = () => {
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = 'tel:+27823334567'; // Example number
    } else {
      window.location.href = 'mailto:supervisor@factory.com?subject=Production Floor Assistance Required';
    }
    
    onCallSupervisor();
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Factory Status */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${getFactoryStatusColor()} rounded-full ${wsConnected && !isReconnecting ? 'animate-pulse' : ''}`}></div>
              <span className="font-medium text-sm">{getFactoryStatusText()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm font-medium">Shift:</span>
              <Badge variant="outline" className="text-xs">
                {getCurrentShift()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">24 operators active</span>
            </div>
          </div>

          {/* Center: Time & Connection Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
              {wsConnected ? 
                <Wifi className="h-4 w-4 text-green-600" /> : 
                <WifiOff className="h-4 w-4 text-red-600" />
              }
              <span className="text-sm font-mono">{formatTime(currentTime)}</span>
              <Badge variant={wsConnected ? "default" : "destructive"} className="text-xs">
                {wsConnected ? 'Live' : 'Offline'}
              </Badge>
            </div>
            
            {isReconnecting && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                Reconnecting...
              </Badge>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshData}
              disabled={wsConnected && !isReconnecting}
              className="gap-1 h-8 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCallSupervisor}
              className="gap-1 h-8 text-xs"
            >
              <Phone className="h-3 w-3" />
              Call Supervisor
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowEmergencyDialog(true)}
              className="gap-1 h-8 text-xs bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="h-3 w-3" />
              Emergency Stop
            </Button>
          </div>
        </div>
      </div>

      {/* Emergency Stop Confirmation Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Emergency Factory Stop
            </DialogTitle>
            <DialogDescription>
              This will immediately stop ALL factory operations. This action cannot be undone.
              Type "STOP" to confirm.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              value={emergencyConfirm}
              onChange={(e) => setEmergencyConfirm(e.target.value)}
              placeholder="Type STOP to confirm"
              className="text-center font-bold"
              autoFocus
            />
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEmergencyDialog(false);
                setEmergencyConfirm('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmergencyStop}
              disabled={emergencyConfirm.toUpperCase() !== 'STOP'}
              className="bg-red-600 hover:bg-red-700"
            >
              EMERGENCY STOP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FactoryStatusHeader;