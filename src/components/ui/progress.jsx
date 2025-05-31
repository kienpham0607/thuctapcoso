import * as React from "react";

const Progress = React.forwardRef(({ value = 0, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative h-2 w-full overflow-hidden rounded-full bg-primary/20 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };