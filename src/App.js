import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import firebase from './firebase';
import ToggleDisplay from 'react-toggle-display';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';

//IMPORTING COMPONENTS
import Header from './Header.js';
import List from './List.js'
import Footer from './Footer.js';

//FONT AWESOME ICONS
const trashCan = <FontAwesomeIcon icon={faTrash} />;

class App extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      rhymeInput: "",
      synInput: "",
      words: [],
      wordInput: "",
      savedWords: "",
      poemLibrary: [],
    };
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();

    dbRef.on("value", (response) => {
      const newState = [];
      const data = response.val();

      for (let key in data) {
        const wordObject = data[key];
        const wordArray = [];
        for (let title in wordObject) {
          console.log(wordObject[title]);

          wordArray.push(wordObject[title]);
        }

        newState.push({
          key: key,
          listofWords: wordArray,
        });

        // console.log(data[key]);
      }

      this.setState({
        poemLibrary: newState,
      });
    });
  }

  handleRemove = (listKey) => {
    const dbRef = firebase.database().ref();
    dbRef.child(listKey).remove();
  };

  // Retrieves Rhyme Results off API based on User Input
  getRhy = () => {
    axios({
      url: "https://api.datamuse.com/words",
      params: {
        max: 12,
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
      wordInput,
    });
  };

  // onClick Handle to get list of rhyming words and to place rhyme words in state
  handleRhy = () => {
    this.setState(
      {
        rhymeInput: this.state.wordInput,
        title: this.state.wordInput,
      },
      () => {
        if (this.state.wordInput === "") {
          alert("This is empty!");
        } else {
          this.getRhy();
        }
      }
    );
  };

  // onClick Handle to get list of synonymns and to place these words in state
  handleSyn = (event) => {
    this.setState(
      {
        synInput: this.state.wordInput,
        title: this.state.wordInput,
      },
      () => {
        if (this.state.wordInput === "") {
          alert("This is empty!");
        } else {
          this.getSyn();
        }
      }
    );
  };

  addToList = (event) => {
    const dbRef = firebase.database().ref(this.state.title);
    dbRef.push(event.target.value);

    this.setState({
      savedWords: event.target.value,
    });
  };

  render() {
    return (
      <div className="App">
        <Header />

        <main className="wrapper">
          <section className="form">
            <label htmlFor="chosenWord">Enter A Word</label>
            <input
              type="text"
              id="chosenWord"
              onChange={this.handleChange}
              value={this.state.wordInput}
              placeholder="Ex: Happy"
            />
            <h2>What kind of words would you like?</h2>
            <div class="buttonFlex">
              <button onClick={() => this.handleSyn()}>Synonyms</button>
              <p>or</p>
              <button onClick={() => this.handleRhy()}>Rhymes</button>
            </div>
          </section>

          <section className="displayedWords">
            <h2>{this.state.title}</h2>
            <ul>
              {this.state.words.map((singleWord) => {
                return (
                  <li key={singleWord.score} className="wordContainer">
                    <button value={singleWord.word} onClick={this.addToList}>
                      {singleWord.word}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="poemLists">
            <ul>
              {this.state.poemLibrary.map((poem) => {
                // console.log(poem.listofWords);

                const myObject = poem.listofWords;


                const wordList = myObject.map((word) => {
                  return <p>{word}</p>;
                });

                return <List key={poem.key} title={poem.key} list={wordList} removeHandle={this.handleRemove}/>;
              })}
            </ul>
          </section>
        </main>
        <footer>
          <Footer />
      </footer>
      </div>
    );
  }

}

export default App;

