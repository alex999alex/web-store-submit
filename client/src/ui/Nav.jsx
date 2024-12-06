import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; 

const Nav = ({ isLoggedIn }) => {
  
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0); 
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
            <div style={{ position: 'relative', fontSize: '24px' }}>
              <FaShoppingCart />
    
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#ff0000',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '14px',
                }}>
                  {cartCount}
                </span>
              )}
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
