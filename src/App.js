import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import Geolocalisation from "./component/Geolocalisation";

function App() {
  const  [data, setData] =  useState()

  useEffect(()=> {
     fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Paris,fr&appid=b336af79478736d4ca65a9ce41592a41`)
          .then(response => response.json())
          .then(data => setData(data));

  },  [])
  console.log(data)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <a

          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Geolocalisation/>
      </header>
    </div>
  );
}

export default App;
