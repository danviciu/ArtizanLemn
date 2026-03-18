import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-wood-900">
        {label}
        {required ? <span className="ml-1 text-wood-700">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-wood-700/85">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-amber-800" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}
