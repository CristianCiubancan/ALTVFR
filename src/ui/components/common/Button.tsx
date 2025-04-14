import React, { ButtonHTMLAttributes } from 'react';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button component props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   */
  size?: ButtonSize;
  
  /**
   * Displays loading spinner
   */
  loading?: boolean;
  
  /**
   * Makes the button fill its container
   */
  fullWidth?: boolean;
  
  /**
   * Renders the button with a rounded appearance
   */
  rounded?: boolean;
  
  /**
   * Icon to display before the button text
   */
  icon?: React.ReactNode;
}

/**
 * Button component
 * Consistent button styling with variants and sizes
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  rounded = false,
  icon,
  className = '',
  disabled,
  ...rest
}) => {
  // Base classes
  const baseClasses = 'font-medium focus:outline-none transition-colors';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-altv-primary hover:bg-blue-700 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-blue-400 hover:bg-blue-500 text-white',
  };
  
  // Size classes
  const sizeClasses = {
    small: 'text-xs py-1 px-2',
    medium: 'text-sm py-2 px-4',
    large: 'text-base py-3 px-6',
  };
  
  // Additional classes
  const widthClass = fullWidth ? 'w-full' : '';
  const roundedClass = rounded ? 'rounded-full' : 'rounded';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  // Combined classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    roundedClass,
    disabledClass,
    className,
  ].join(' ');
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...rest}
    >
      <div className="flex items-center justify-center">
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        
        {!loading && icon && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
      </div>
    </button>
  );
};