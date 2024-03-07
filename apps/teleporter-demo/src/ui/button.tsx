import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex gap-2 items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'primary-gradient':
          'bg-primary text-primary-foreground hover:bg-primary/90 bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to',
      },
      size: {
        default: 'h-10 px-4 py-2 text-md  [&>svg]:w-4 [&>svg]:h-4',
        sm: 'h-8 px-3 gap-1 [&>svg]:w-4 [&>svg]:h-4',
        lg: 'h-11 px-8 [&>svg]:w-4 [&>svg]:h-4',
        icon: 'h-10 w-10',
        link: 'h-10 gap-0.5 px-0 py-1 -my-1 text-md  [&>svg]:w-4 [&>svg]:h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, startIcon, endIcon, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {startIcon}
        {children}
        {endIcon}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
