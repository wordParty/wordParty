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
    };
  }

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

  handleRhy = () => {
    if (true) {
      this.setState(
        {
          rhymeInput: "happy",
          title: "Rhyme test"
        },
        () => {
          this.getRhy();
        }
      );
    }
  };

  handleSyn = () => {
    if (true) {
      this.setState(
        {
          synInput: "test",
          title: "Synonym test",
        },
        () => {
          this.getSyn();
        }
      );
    }
  };

  render() {
    return (
      <div className="App wrapper">
        <button onClick={() => this.handleSyn()}>Synonyms</button>
        <button onClick={() => this.handleRhy()}>Rhymes</button>
        <h1>{this.state.title}</h1>
        {this.state.words.map((singleWord) => {
          return (
            <div key={singleWord.score} className="wordContainer">
              <p onClick={alert('whoot!')}>{singleWord.word}</p>
            </div>
          );
        })}
        
      </div>
    );
  }
}

export default App;
=======