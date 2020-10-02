import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const trashCan = <FontAwesomeIcon icon={faTrash} />;
const exit = <FontAwesomeIcon icon={faTimes} />;

export class App extends Component {
  render() {
    return (
			<div>
      <button>rendered word</button>
			</div>
		);
  }
}

export default App;

