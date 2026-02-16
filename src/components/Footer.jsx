import React from 'react';

const footerStyle = {
  background: '#333',
  color: '#fff',
  padding: '10px 0',
  textAlign: 'center',
  position: 'fixed',
  width: '100%',
  bottom: 0,
};

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2025 Grant Maestro. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
