import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Download, Eye, Printer, FileSpreadsheet } from 'lucide-react';

interface Props {
  payroll: any;
  onBankCsv: () => void;
  onCellCsv: () => void;
  onAccounting: () => void;
  onViewSlips: () => void;
  onPrint: () => void;
}

/**
 * Row actions for a payroll run.
 *
 * The row previously carried a separate column for each of Bank CSV, Cell CSV,
 * Accounting, View and Print — five columns of single icons, and more were
 * still to be added. Grant agreed to collapsing them into one menu rather than
 * widening the table further.
 */
const PayrollRowActions: React.FC<Props> = ({
  payroll, onBankCsv, onCellCsv, onAccounting, onViewSlips, onPrint,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Actions">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel className="text-xs">Payroll run #{payroll.id}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={onViewSlips} className="gap-2 text-xs">
        <Eye className="h-3.5 w-3.5" />
        View payslips &amp; documents
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onPrint} className="gap-2 text-xs">
        <Printer className="h-3.5 w-3.5" />
        Print summary
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-xs text-muted-foreground">Downloads</DropdownMenuLabel>

      <DropdownMenuItem onClick={onBankCsv} className="gap-2 text-xs">
        <Download className="h-3.5 w-3.5" />
        Bank file
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onCellCsv} className="gap-2 text-xs">
        <Download className="h-3.5 w-3.5 text-orange-500" />
        Cell phone payments
      </DropdownMenuItem>
      {/* Youth @ Work has no SimplePay client, so there is no accounting report. */}
      {payroll.factory !== 'YOUTH_WORK' && (
        <DropdownMenuItem onClick={onAccounting} className="gap-2 text-xs">
          <FileSpreadsheet className="h-3.5 w-3.5 text-purple-600" />
          Accounting report
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default PayrollRowActions;
