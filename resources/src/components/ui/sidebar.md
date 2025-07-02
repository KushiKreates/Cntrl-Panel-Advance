import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sidebar = SheetPrimitive.Root

const SidebarTrigger = SheetPrimitive.Trigger

const SidebarClose = SheetPrimitive.Close

const SidebarPortal = SheetPrimitive.Portal

const SidebarOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SidebarOverlay.displayName = SheetPrimitive.Overlay.displayName

const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-50 flex h-full w-80 flex-col border-r bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  {
    variants: {
      size: {
        default: "w-80",
        sm: "w-[300px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const SidebarContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> &
    VariantProps<typeof sidebarVariants>
>(({ size, className, ...props }, ref) => (
  <SheetPortal>
    <SidebarOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sidebarVariants({ size }), className)}
      {...props}
    />
  </SheetPortal>
))
SidebarContent.displayName = SheetPrimitive.Content.displayName

const SidebarHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-4 border-b p-4",
      className
    )}
    {...props}
  />
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "border-t p-4",
      className
    )}
    {...props}
  />
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SidebarTitle.displayName = SheetPrimitive.Title.displayName

const SidebarDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sidebar,
  SidebarTrigger,
  SidebarClose,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTitle,
  SidebarDescription,
}
