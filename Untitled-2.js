
import React from 'react';

const Button = ({ label, onClick, type = "button", style = {} }) => {
return (
 <button type={type} onClick={onClick} style={style}>
 {label}
</button>
 );
};
export default Button; 