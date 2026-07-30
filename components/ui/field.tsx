'use client';

import { forwardRef, useId, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Floating-label form fields.
 *
 * The label rides on the `:placeholder-shown` state rather than JavaScript, so
 * it behaves correctly with autofill, back-navigation restore, and before
 * hydration. A gold rule under the field draws itself in on focus.
 */

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
  /** Selects do not support `:placeholder-shown`, so their label stays raised. */
  alwaysRaised?: boolean;
};

const labelBase =
  'pointer-events-none absolute left-0 origin-left text-muted transition-all duration-300 ease-premium';

/** The label's default position. `peer-placeholder-shown:` drops it back down
 *  to sit inside an empty field, and `peer-focus:` lifts it again. */
const raised = 'top-0 text-[0.6875rem] uppercase tracking-[0.18em]';

function FieldShell({ id, label, error, className, children, alwaysRaised }: FieldShellProps) {
  return (
    <div className={cn('group relative pt-7', className)}>
      {children}

      <label
        htmlFor={id}
        className={cn(
          labelBase,
          alwaysRaised
            ? raised
            : [
                raised,
                // Resting inside an empty field the label reads as a prompt in
                // sentence case; lifting it turns it into a small caps label.
                'peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal',
                'peer-focus:top-0 peer-focus:text-[0.6875rem] peer-focus:uppercase peer-focus:tracking-[0.18em]',
              ],
          'peer-focus:text-gold',
          error && 'text-red-500 peer-focus:text-red-500',
        )}
      >
        {label}
      </label>

      {/* Static hairline plus a gold rule that scales in from the left on focus. */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-line" />
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold',
          'transition-transform duration-500 ease-premium',
          'peer-focus:scale-x-100',
          error && 'scale-x-100 bg-red-500',
        )}
      />

      <p
        id={`${id}-error`}
        role={error ? 'alert' : undefined}
        className={cn(
          'overflow-hidden text-[0.75rem] text-red-500 transition-all duration-300 ease-premium',
          error ? 'mt-2.5 max-h-10 opacity-100' : 'mt-0 max-h-0 opacity-0',
        )}
      >
        {error}
      </p>
    </div>
  );
}

const inputBase = cn(
  'peer w-full appearance-none border-0 bg-transparent pb-3 pt-1',
  'text-[1.0625rem] text-ink placeholder:text-transparent',
  // The animated gold rule and the label colour shift are the focus indicator,
  // so the global focus ring would only add noise here.
  'outline-none focus:ring-0 focus-visible:outline-none',
);

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'id'> & {
  label: string;
  error?: string;
  wrapperClassName?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className, wrapperClassName, ...props }, ref) => {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} className={wrapperClassName}>
        <input
          ref={ref}
          id={id}
          // A single space keeps `:placeholder-shown` meaningful while showing nothing.
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputBase, className)}
          {...props}
        />
      </FieldShell>
    );
  },
);
TextField.displayName = 'TextField';

type TextAreaFieldProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'id'> & {
  label: string;
  error?: string;
  wrapperClassName?: string;
};

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, className, wrapperClassName, rows = 4, ...props }, ref) => {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} className={wrapperClassName}>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputBase, 'resize-none leading-relaxed', className)}
          {...props}
        />
      </FieldShell>
    );
  },
);
TextAreaField.displayName = 'TextAreaField';

type SelectFieldProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string;
  error?: string;
  options: readonly string[];
  placeholder?: string;
  wrapperClassName?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder = 'Select a range', className, wrapperClassName, ...props }, ref) => {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} className={wrapperClassName} alwaysRaised>
        <select
          ref={ref}
          id={id}
          defaultValue=""
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputBase, 'cursor-pointer pr-8 text-ink [&>option]:bg-surface [&>option]:text-ink', className)}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-0 h-2 w-2 rotate-45 border-b border-r border-muted transition-colors duration-300 group-focus-within:border-gold"
        />
      </FieldShell>
    );
  },
);
SelectField.displayName = 'SelectField';
