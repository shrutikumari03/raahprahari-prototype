import * as React from 'react'
import { cn } from '@/lib/utils'
import { useFieldProps } from '@/components/ui/field'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  const fieldProps = useFieldProps(props)
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'rp-field glass flex field-sizing-content min-h-11 w-full rounded-xl border-muted-foreground/70 px-3 py-2 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...fieldProps}
    />
  )
}

export { Textarea }
