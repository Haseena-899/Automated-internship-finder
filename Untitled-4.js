
import React from 'react';
// A modal component that appears as a popup when 'isOpen' is true
const Modal = ({ isOpen, onClose, children }) => {
if (!isOpen) return null; // Don't render if not open
return (
<div style={{
position: 'fixed',
top: 0, left: 0, right: 0, bottom: 0,
backgroundColor: 'rgba(0, 0, 0, 0.5)',
display: 'flex', justifyContent: 'center', alignItems: 'center',
zIndex: 1000
 }}>
<div style={{
backgroundColor: '#fff',
padding: '20px',
borderRadius: '10px',
minWidth: '300px',
maxWidth: '500px'
 }}>
<button onClick={onClose} style={{ float: 'right' }}>X</button>
 {children}
</div>
</div>
 );
};
export default Modal;