import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type DivProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: DivProps) {
  return <div className={cn('card', className)} {...props} />
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn('card-header', className)} {...props} />
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn('card-content', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('card-title', className)} {...props} />
}
