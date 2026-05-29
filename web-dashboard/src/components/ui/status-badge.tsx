import * as React from "react"
import { cn } from "@/lib/utils"

export type TaxStatus =
  | 'not_started' | 'awaiting_documents' | 'documents_under_review' | 'in_progress'
  | 'ready_to_file' | 'filed' | 'completed' | 'rejected' | 'needs_correction'
  | 'on_hold' | 'pending' | 'approved' | 'underReview';

const STATUS_BADGE_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  not_started:             { label: 'Not Started',    bg: 'bg-gray-100',        text: 'text-gray-600',   dot: 'bg-gray-400'    },
  awaiting_documents:      { label: 'Awaiting Docs',  bg: 'bg-warning-light',   text: 'text-warning',    dot: 'bg-warning'     },
  documents_under_review:  { label: 'Under Review',   bg: 'bg-info-light',      text: 'text-info',       dot: 'bg-info'        },
  underReview:             { label: 'Under Review',   bg: 'bg-brand-primary-light', text: 'text-brand-primary', dot: 'bg-brand-primary' },
  in_progress:             { label: 'In Progress',    bg: 'bg-info-light',      text: 'text-info',       dot: 'bg-info'        },
  ready_to_file:           { label: 'Ready to File',  bg: 'bg-success-light',   text: 'text-success',    dot: 'bg-success'     },
  filed:                   { label: 'Filed',          bg: 'bg-success-light',   text: 'text-success',    dot: 'bg-success'     },
  completed:               { label: 'Completed',      bg: 'bg-success-light',   text: 'text-success',    dot: 'bg-success'     },
  rejected:                { label: 'Rejected',       bg: 'bg-danger-light',    text: 'text-danger',     dot: 'bg-danger'      },
  needs_correction:        { label: 'Needs Correction',bg: 'bg-danger-light',   text: 'text-danger',     dot: 'bg-danger'      },
  on_hold:                 { label: 'On Hold',        bg: 'bg-gray-100',        text: 'text-gray-500',   dot: 'bg-gray-400'    },
  pending:                 { label: 'Pending',        bg: 'bg-warning-light',   text: 'text-warning',    dot: 'bg-warning'     },
  approved:                { label: 'Approved',       bg: 'bg-success-light',   text: 'text-success',    dot: 'bg-success'     },
  verified:                { label: 'Verified',       bg: 'bg-success-light',   text: 'text-success',    dot: 'bg-success'     },
};

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
}

export function TZStatusBadge({ status, size = 'sm', variant = 'default', className, ...props }: StatusBadgeProps) {
  const config = STATUS_BADGE_CONFIG[status] || STATUS_BADGE_CONFIG['not_started'];

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px]',
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md transition-all duration-300",
        config.bg,
        config.text,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </div>
  )
}
