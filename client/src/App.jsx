import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <>
      <h2>Nav</h2>
      <p>This is the parent page:</p>

      <div>
        <Nav isLoggedIn={isLoggedIn} />
      </div>

      <br />
      <hr />
      <div>
        <p>This is the child page:</p>
        <Outlet context={setIsLoggedIn} />
      </div>
    </>
  );
}

export default App;