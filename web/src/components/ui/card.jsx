import * as React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-xl border border-border bg-card text-card-foreground shadow-2xl shadow-black/40', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-3', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardContent };
