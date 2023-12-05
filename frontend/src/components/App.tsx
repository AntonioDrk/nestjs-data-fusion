import React from 'react';
import './App.css';
import Navbar from './nav/Navbar';
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import SignIn from './auth/signin';
import axios from 'axios';
import Posts from './posts';
import WeatherInfo from './weather';

function App() {
  axios.defaults.withCredentials = true;
  const [isLoggedIn, setIsLoggedIn] = React.useState(localStorage.getItem("token") !== null);
  const location = useLocation();

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Navbar>
      <div>
        {isLoggedIn && location.pathname === '/' && <Posts isLoggedIn={isLoggedIn} />}
        {!isLoggedIn && location.pathname === '/' && <div className="text-3xl text-gray-400">Sign into the application to view data</div>}
        <Routes>
          {isLoggedIn ?
            <Route path="/weather" element={<WeatherInfo isLoggedIn={isLoggedIn} />} />
            :
            <Route path="/signin" element={<SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          }
        </Routes>
      </div>
    </div>
  );
}

export default App;
