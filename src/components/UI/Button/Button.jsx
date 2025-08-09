import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick,
  type = 'button',
  ...props 
}) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;