import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const PageIntroTrigger = ({
  icon: IconComponent,
  title,
  description,
  className,
  iconClassName,
  align = 'start',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={title}
        onClick={() => setOpen(true)}
        className={cn(
          'rounded-2xl border border-transparent hover:border-white/10 transition-all duration-200 flex items-center justify-center w-12 h-12',
          className,
        )}
      >
        {IconComponent ? (
          <IconComponent active className={cn('h-9 w-9', iconClassName)} />
        ) : (
          <span className="sr-only">{title}</span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg glass-effect">
          <DialogHeader className={cn('space-y-4', align === 'center' && 'text-center items-center')}>
            {IconComponent && (
              <IconComponent active className="h-14 w-14" />
            )}
            <DialogTitle className="text-2xl font-bold text-glow">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-base leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PageIntroTrigger;
