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
            activeStyle={{ fontWeight: 'bold' }}
          >
            Home
          </NavLink>
        </li>


        {/* <li>
          <NavLink
            to="/details"
            style={linkStyle}
            activeStyle={activeLinkStyle}
          >
            Details
          </NavLink>
        </li> */}


        {/* <li>
          <NavLink
            to="/signup"
            style={linkStyle}
            activeStyle={activeLinkStyle}
          >
            Signup
          </NavLink>
        </li> */}




        <li>
          <NavLink
            to="/login"
            exact="true"
            style={linkStyle}
            activeStyle={{ fontWeight: 'bold' }}
          >
            Login
          </NavLink>
        </li>
        
        
        
        <li>
          <NavLink
            to="/Cart"
            exact="true"
            style={linkStyle}
            activeStyle={{ fontWeight: 'bold' }}
          >
            Cart
          </NavLink>
        </li>




        <li>
          <NavLink
            to="/logout"
            exact="true"
            style={linkStyle}
            activeStyle={{ fontWeight: 'bold' }}
          >
            Logout
          </NavLink>
        </li>


        


        {/* <li>
          <NavLink
            to="/Checkout"
            style={linkStyle}
            activeStyle={activeLinkStyle}
          >
            Checkout
          </NavLink>
        </li> */}


        {/* <li>
          <NavLink
            to="/Confirmation"
            style={linkStyle}
            activeStyle={activeLinkStyle}
          >
            Confirmation
          </NavLink>
        </li> */}



        {/* <li>
          <NavLink
            to="/address"
            style={linkStyle}
            activeStyle={activeLinkStyle}
          >
            Address
          </NavLink>
        </li> */}


      </ul>
    </nav>
  );
};

export default Nav;
