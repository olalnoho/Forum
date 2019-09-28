import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/main.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { GlobalProvider } from './context/Global'

ReactDOM.render(
   <Router>
      <GlobalProvider>
         <App />
      </GlobalProvider>
   </Router>,
   document.getElementById('root')
);