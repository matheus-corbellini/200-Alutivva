import React from "react";
import "./Button.css";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "transparent";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  disabled?: boolean;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  type = "button",
  style,
  disabled = false,
  className,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <button
      className={`custom-btn ${variant} ${size} ${
        className ? className : ""
      }`.trim()}
      onClick={onClick}
      type={type}
      style={style}
      disabled={disabled}
      {...props}
    >
      {startIcon && <span className="btn-icon start">{startIcon}</span>}
      {children}
      {endIcon && <span className="btn-icon end">{endIcon}</span>}
    </button>
  );
};

export default Button;
