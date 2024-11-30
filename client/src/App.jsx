import { Outlet } from 'react-router-dom';
// import Sidebar from './ui/Sidebar';
import Nav from './ui/Nav';


function App() {

  return (
    <>
      <h2>Nav</h2>
      <p>This is the parent page:</p>

      <div>
        <Nav />
      </div>

      <br />
      <hr />
      <div>
        <p>This is the child page:</p>
        <Outlet />
      </div> 
    </>
  )
  
}

export default App
