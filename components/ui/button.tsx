'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cloneElement, forwardRef, isValidElement, type ReactElement, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden',
    'whitespace-nowrap rounded-full font-medium tracking-[-0.01em]',
    'transition-[transform,box-shadow,background-color,color,border-color] duration-500 ease-premium',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        /** Primary action — navy in light, bone in dark, gold glow on hover. */
        primary: 'bg-ink text-bg shadow-lift hover:shadow-glow hover:-translate-y-0.5',
        /** Quiet secondary — a hairline that fills with the faintest gold wash. */
        outline:
          'border border-line bg-transparent text-ink hover:border-gold/60 hover:bg-gold/[0.06] hover:-translate-y-0.5',
        gold: 'bg-gold text-navy shadow-lift hover:shadow-glow hover:-translate-y-0.5',
        ghost: 'text-ink hover:bg-ink/[0.05]',
      },
      size: {
        sm: 'h-10 px-5 text-[0.8125rem]',
        md: 'h-12 px-7 text-[0.875rem]',
        lg: 'h-14 px-9 text-[0.9375rem]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Diagonal light sweep on hover. Defaults on for solid variants. */
  sheen?: boolean;
}

/** Decorative light sweep. CSS-only, so it costs nothing at runtime. */
function Sheen() {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg]',
        'bg-gradient-to-r from-transparent via-white/25 to-transparent',
        'transition-transform [transition-duration:900ms] ease-premium group-hover:translate-x-full',
        'motion-reduce:hidden',
      )}
    />
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, sheen, children, ...props }, ref) => {
    // Solid variants only — a light sweep across a transparent button reads as a glitch.
    const showSheen = sheen ?? (variant === undefined || variant === 'primary' || variant === 'gold');
    const classes = cn(buttonVariants({ variant, size }), className);

    const decorate = (inner: ReactNode) => (
      <>
        {showSheen ? <Sheen /> : null}
        <span className="relative z-10 inline-flex items-center gap-2.5">{inner}</span>
      </>
    );

    // `Slot` accepts exactly one child, so the decorations have to be merged
    // *into* the consumer's element rather than rendered beside it.
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ children?: ReactNode }>;
      return (
        <Slot className={classes} ref={ref} {...props}>
          {cloneElement(child, undefined, decorate(child.props.children))}
        </Slot>
      );
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {decorate(children)}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
