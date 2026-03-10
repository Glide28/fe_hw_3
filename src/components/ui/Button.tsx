import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
    children: ReactNode;
};

export function Button({
    variant = 'primary',
    fullWidth = false,
    children,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
        className={`button button--${variant} ${fullWidth ? 'button--full' : ''} ${className}`}
        {...props}
        >
        {children}
        </button>
    );
}