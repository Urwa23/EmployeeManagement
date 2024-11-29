import React from 'react';
import PropTypes from 'prop-types';
import './button.scss'; // Optional CSS file for custom styling

const Button = ({
  text,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
};

// Prop types for validation
Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
