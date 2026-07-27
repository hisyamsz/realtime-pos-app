import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { EllipsisVertical } from 'lucide-react';

export default function DropdownAction({
  menu,
}: {
  menu: {
    label: string | ReactNode;
    variant?: 'destructive' | 'default';
    action?: () => void;
    type?: 'item' | 'link';
    disabled?: boolean;
    tooltip?: string;
  }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground size-8"
          size="icon"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {menu.map((item, index) => (
          <DropdownMenuItem
            key={`dropdown-action-${index}`}
            variant={item.variant || 'default'}
            asChild={item.type === 'link'}
            disabled={item.disabled}
            title={item.tooltip}
            className="cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:cursor-not-allowed"
            onClick={item.action}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
