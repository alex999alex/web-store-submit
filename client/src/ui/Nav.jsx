import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Import shopping cart icon

const Nav = ({ isLoggedIn }) => {
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

  const activeLinkStyle = {
    fontWeight: 'bold',
    color: '#007bff',
  };

  return (
    <nav style={NavStyle}>
      <ul style={listStyle}>
        <li>
          <NavLink
            to="/"
            exact="true"
            style={linkStyle}
            activeStyle={activeLinkStyle}
          >
            Home
          </NavLink>
        </li>

        {/* Show Login if not logged in, else show Logout */}
        {!isLoggedIn ? (
          <>
            <li>
              <NavLink
                to="/login"
                exact="true"
                style={linkStyle}
                activeStyle={activeLinkStyle}
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/signup"
                exact="true"
                style={linkStyle}
                activeStyle={activeLinkStyle}
              >
                Signup
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/logout"
              exact="true"
              style={linkStyle}
              activeStyle={activeLinkStyle}
            >
              Logout
            </NavLink>
          </li>
        )}

        <li>
          <NavLink
            to="/cart"
            exact="true"
            style={linkStyle}
            activeStyle={activeLinkStyle}
          >
            <FaShoppingCart /> 
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav; //
