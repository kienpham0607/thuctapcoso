"use client"

const Spinner = ({ className = "", ...props }) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-e-transparent h-6 w-6 ${className}`}
      role="status"
      aria-label="loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export { Spinner };