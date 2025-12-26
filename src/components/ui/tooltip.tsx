'use client'

import * as React from 'react'

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ open?: boolean }>, { open })
        }
        return child
      })}
    </div>
  )
}

const TooltipTrigger = ({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) => {
  if (asChild && React.isValidElement(children)) {
    return children
  }
  return <span className="cursor-help">{children}</span>
}

const TooltipContent = ({
  children,
  open,
  className,
}: {
  children: React.ReactNode
  open?: boolean
  className?: string
}) => {
  if (!open) return null

  return (
    <div
      className={`absolute z-50 px-3 py-1.5 text-xs text-white bg-slate-900 rounded-md -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-md animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      {children}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
