import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <>
      <div>
        <Nav isLoggedIn={isLoggedIn} />
      </div>

      <br />
      <hr />
      <div>
        <Outlet context={setIsLoggedIn} />
      </div>
    </>
  );
}

export default App;