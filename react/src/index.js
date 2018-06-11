import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import { Router, hashHistory } from 'react-router'
import routes from './routes';

//Render the application in react dom, the routes will decide which component to render
ReactDOM.render(
  <Router history={hashHistory} routes={routes} />
  , document.querySelector('.app_container'));
