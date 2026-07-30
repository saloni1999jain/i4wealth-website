'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * A deliberately thin slider. The track is a hairline; the thumb is a small
 * gold disc that grows on hover and focus. Nothing bounces.
 */
const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center py-3', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-line">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-gold-deep to-gold" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        'block h-5 w-5 rounded-full border-2 border-gold bg-bg',
        'shadow-[0_2px_10px_-2px_rgb(200_164_90_/_0.7)]',
        'transition-[transform,box-shadow] duration-300 ease-premium',
        'hover:scale-110 focus-visible:scale-110',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25',
        'disabled:pointer-events-none disabled:opacity-50',
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = 'Slider';

export { Slider };
