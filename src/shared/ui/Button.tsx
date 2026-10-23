import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "text";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "inline-flex items-center justify-center gap-3 h-11 px-4.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm rounded-[7px] cursor-pointer",
    text: "px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold text-xs rounded-[7px] cursor-pointer transition-colors",
  };

  return (
    <button className={`${variants[variant]} ${className || ""}`} {...props} />
  );
}
