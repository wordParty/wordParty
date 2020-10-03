import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import ToggleDisplay from 'react-toggle-display';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';

//FONT AWESOME ICONS
const trashCan = <FontAwesomeIcon icon={faTrash} />;
const exit = <FontAwesomeIcon icon={faTimes} />;


class App extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      rhymeInput: "",
      synInput: "",
      words: [],
      wordInput: ""
    };
  }

  // Retrieves Rhyme Results off API based on User Input
  getRhy = () => {
    axios({
      url: "https://api.datamuse.com/words",
      params: {
        max: 10,
        rel_rhy: this.state.rhymeInput,
      },
    }).then((response) => {
      let wordsResults = response.data;
      this.setState({
        words: wordsResults,
      });
    });
  };

    // Retrieves Synonymn Results off API based on User Input
  getSyn = () => {
    axios({
      url: "https://api.datamuse.com/words",
      params: {
        max: 10,
        ml: this.state.synInput,
      },
    }).then((response) => {
      let wordsResults = response.data;
      this.setState({
        words: wordsResults,

      });
    });
  };

  // Logs user input and saves to state
  handleChange = (event) => {
    let wordInput = event.target.value;
    this.setState({
      wordInput
    }
    )
  }

  // onClick Handle to get list of rhyming words and to place rhyme words in state
  handleRhy = () => {
      this.setState(
        {
          rhymeInput: this.state.wordInput,
          title: this.state.wordInput
        },
        () => {
          if (this.state.wordInput === "") {
            alert('This is empty!')
          } else {this.getRhy()}
        }
      );
  };

  // onClick Handle to get list of synonymns and to place these words in state
  handleSyn = (event) => {
      this.setState(
        {
          synInput: this.state.wordInput,
          title: this.state.wordInput
        },
        () => {
          if (this.state.wordInput === "") {
            alert('This is empty!')
          } else {this.getSyn()}
        }
      );
  };

  render() {
    return (
      <div className="App wrapper">
        <label htmlFor="chosenWord">Enter A Word</label>

        <input
          type="text"
          id="chosenWord"
          onChange={this.handleChange}
          value={this.state.wordInput} />
        
        <button onClick={() => this.handleSyn()}>Synonyms</button>
        <button onClick={() => this.handleRhy()}>Rhymes</button>
        <h1>{this.state.title}</h1>
        {this.state.words.map((singleWord) => {
          return (
            <div key={singleWord.score} className="wordContainer">
              <p>{singleWord.word}</p>
            </div>
          );
        })}
        
      </div>
    );
  }
}

export default App;