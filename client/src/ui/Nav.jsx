import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  const NavStyle = {
    width: '200px',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderRight: '1px solid #ddd',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    display: 'block',
    padding: '8px 0',
  };

  return (
    <nav style={NavStyle}>
      <ul style={listStyle}>
        <li>
          <NavLink to="/" exact="true" style={linkStyle} activeStyle={{ fontWeight: 'bold' }}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" exact="true" style={linkStyle} activeStyle={{ fontWeight: 'bold' }}>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/Cart" exact="true" style={linkStyle} activeStyle={{ fontWeight: 'bold' }}>
            Cart
          </NavLink>
        </li>
        <li>
          <NavLink to="/logout" exact="true" style={linkStyle} activeStyle={{ fontWeight: 'bold' }}>
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
