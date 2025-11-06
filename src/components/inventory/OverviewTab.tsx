import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BarChart3,
  ArrowRight
} from 'lucide-react';

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R2.4M</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">23</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              5 critical alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Turnover</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2x</div>
            <p className="text-xs text-muted-foreground">
              Annual turnover rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span className="text-sm">Raw Materials</span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={75} className="w-20 h-2" />
                  <span className="text-sm font-medium">R1.8M</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary rounded"></div>
                  <span className="text-sm">Finished Goods</span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={45} className="w-20 h-2" />
                  <span className="text-sm font-medium">R420K</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded"></div>
                  <span className="text-sm">Work in Progress</span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={30} className="w-20 h-2" />
                  <span className="text-sm font-medium">R180K</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="text-sm font-medium">IWISA Film Roll</p>
                    <p className="text-xs text-muted-foreground">2 days stock remaining</p>
                  </div>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-secondary-foreground" />
                  <div>
                    <p className="text-sm font-medium">Ink Cartridge - Black</p>
                    <p className="text-xs text-muted-foreground">5 units remaining</p>
                  </div>
                </div>
                <Badge variant="secondary">Low</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-secondary-foreground" />
                  <div>
                    <p className="text-sm font-medium">Adhesive Compound</p>
                    <p className="text-xs text-muted-foreground">8 days stock remaining</p>
                  </div>
                </div>
                <Badge variant="secondary">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Stock Movements</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              View All <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">IWISA 25kg Film</p>
                  <p className="text-xs text-muted-foreground">Stock Receipt</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">+500 rolls</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Custom 5kg Material</p>
                  <p className="text-xs text-muted-foreground">Production Issue</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-destructive">-150 units</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Printing Ink - Blue</p>
                  <p className="text-xs text-muted-foreground">Production Use</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-secondary-foreground">-25 units</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;