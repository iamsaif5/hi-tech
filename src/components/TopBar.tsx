
import React from 'react';
import { Button } from './ui/button';
import { Bell, Moon, Sun, Sparkles, Home } from 'lucide-react';
import { Input } from './ui/input';

interface TopBarProps {
  currentPage?: string;
}

const TopBar = ({ currentPage = 'Dashboard' }: TopBarProps) => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="h-12 bg-background flex items-center justify-between px-4 relative border-b border-border">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Home className="h-3.5 w-3.5" />
          <span>Dashboard</span>
          {currentPage !== 'Dashboard' && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium">{currentPage}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Center: Ask AI Anything */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Sparkles className="h-3.5 w-3.5" />
        </Button>
        <Input 
          placeholder="Ask AI Anything" 
          className="max-w-md bg-accent/50 border-border h-7 text-xs"
        />
      </div>
      
      {/* Right: Icons */}
      <div className="flex items-center gap-1 flex-1 justify-end">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleTheme}>
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </Button>
        
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Bell className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
