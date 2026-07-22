import { ReactNode } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ActionItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'edit' | 'destructive';
  className?: string;
  disabled?: boolean;
}

export interface DropdownActionProps {
  onEdit?: () => void;
  onDelete?: () => void;
  actions?: ActionItem[];
  align?: 'start' | 'center' | 'end';
}

export default function DropdownAction({
  onEdit,
  onDelete,
  actions = [],
  align = 'end',
}: DropdownActionProps) {
  const items: ActionItem[] = [
    ...(onEdit
      ? [
          {
            label: 'Edit',
            icon: <Edit className="mr-2 h-4 w-4 text-blue-600" />,
            onClick: onEdit,
            variant: 'edit' as const,
          },
        ]
      : []),
    ...actions,
    ...(onDelete
      ? [
          {
            label: 'Delete',
            icon: <Trash2 className="mr-2 h-4 w-4 text-red-600" />,
            onClick: onDelete,
            variant: 'destructive' as const,
          },
        ]
      : []),
  ];

  if (items.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item, idx) => {
          let variantStyle = 'cursor-pointer';
          if (item.variant === 'edit') {
            variantStyle = 'cursor-pointer text-blue-600 focus:bg-blue-50 focus:text-blue-700';
          } else if (item.variant === 'destructive') {
            variantStyle = 'cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700';
          }

          return (
            <DropdownMenuItem
              key={idx}
              disabled={item.disabled}
              className={item.className || variantStyle}
              onClick={item.onClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
