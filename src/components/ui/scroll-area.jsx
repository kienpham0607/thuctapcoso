import * as React from "react"
import { cn } from "../../utils/cn"

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative overflow-auto",
      "[&::-webkit-scrollbar]:w-2",
      "[&::-webkit-scrollbar-track]:bg-transparent",
      "[&::-webkit-scrollbar-thumb]:rounded-full",
      "[&::-webkit-scrollbar-thumb]:bg-slate-300",
      "[&::-webkit-scrollbar-thumb:hover]:bg-slate-400",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };