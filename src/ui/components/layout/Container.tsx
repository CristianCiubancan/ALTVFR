import React from 'react';

/**
 * Container component props
 */
export interface ContainerProps {
  /**
   * Container content
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Max width of the container
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /**
   * Whether to center the container
   */
  centered?: boolean;
  
  /**
   * Container padding
   */
  padding?: 'none' | 'small' | 'medium' | 'large';
}

/**
 * Container component
 * Provides a consistent container for content with responsive width control
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  centered = true,
  padding = 'medium',
}) => {
  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-8',
  };
  
  // Combined classes
  const containerClasses = [
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    centered ? 'mx-auto' : '',
    'w-full',
    className,
  ].join(' ');
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};