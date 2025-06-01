import * as React from "react"
import { cn } from "../../utils/cn"

const RadioGroupContext = React.createContext(null);

const RadioGroup = React.forwardRef(({ value, onValueChange, className, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div 
        ref={ref}
        role="radiogroup"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);
  const checked = String(context?.value) === String(value);

  return (
    <button
      ref={ref}
      role="radio"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        "group relative rounded-full",
        "h-4 w-4 border",
        "border-primary text-primary",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => context?.onValueChange?.(value)}
      type="button"
      {...props}
    >
      {checked && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-2.5 w-2.5 rounded-full bg-current"/>
        </span>
      )}
      {children}
    </button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };