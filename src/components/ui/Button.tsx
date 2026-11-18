import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonStyles = cva('button', {
  variants: {
    variant: {
      default: 'button-primary',
      outline: 'button-outline',
      ghost: 'button-ghost',
      soft: 'button-soft',
    },
    size: {
      default: 'button-md',
      sm: 'button-sm',
      icon: 'button-icon',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonStyles>
  & { asChild?: boolean }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'
    return <Component ref={ref} className={cn(buttonStyles({ variant, size }), className)} {...props} />
  },
)

Button.displayName = 'Button'
