import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import "./Button.css";

const Button = ({ onClick, type, label, size, color, disabled, ...props }) => {
    const buttonClasses = classNames('customBtn', {
        'large': size === 'large',
        'normal': size === 'normal',
        'blue': color === 'blue',
        'red': color === 'red',
        'green': color === 'green',
        'greenyellow': color === 'greenyellow'
    });

    return (
        <button
            onClick={onClick}
            className={buttonClasses}
            type={type}
            disabled={disabled}
            {...props}
        >
            {label}
        </button>
    );
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['large', 'normal']),
    color: PropTypes.oneOf(['blue', 'red', 'green', 'greenyellow']),
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    type: 'button',
    size: 'normal',
    color: 'greenyellow',
    disabled: false,
};

export default Button;
