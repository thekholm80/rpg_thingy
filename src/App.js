import React, { Component } from 'react';
import Main from './Game/Main';

import './App.css';

class App extends Component {
  componentDidMount() {
    new Main();
  }

  render() {
    return (
      <div className="App">
        <canvas id='game' width='800' height='600'></canvas>
        <canvas id='hud' width='800' height='600'></canvas>
        <canvas id='actions' width='800' height='600'></canvas>
      </div>
    );
  }
}

export default App;
