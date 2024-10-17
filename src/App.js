import React from 'react';
import './App.css';
import 'bootstrap'
import CocktailList from "./component/CocktailList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CocktailsDetails from "./component/CocktailsDetails";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<CocktailList />} />
                    <Route path="/cocktails/:id" element={<CocktailsDetails/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App; // Ensure this line is present
