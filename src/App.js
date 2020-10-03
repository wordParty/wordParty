import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import firebase from './firebase';
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
			title: '',
			rhymeInput: '',
			synInput: '',
			words: [],
      wordInput: "",
      savedWords: '',
      poemLibrary: [],
		};


  
  componentDidMount(){
    const dbRef = firebase.database().ref();
  
      dbRef.on('value', (response) => {
				const newState = [];
				const data = response.val();

				for (const key in data) {
					newState.push({
						key: key,
						listofWords: data[key],
          });
          
          console.log(data[key]);
				}
    
			this.setState({
					poemLibrary: newState,
				});
			});
     
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

	addToList = (event) => {

    const dbRef = firebase.database().ref(this.state.title);
    dbRef.push(event.target.value);

    this.setState({
     savedWords: event.target.value
    })
    
  };


	render() {
		return (
			<div className='App wrapper'>
          <label htmlFor="chosenWord">Enter A Word</label>

        <input
          type="text"
          id="chosenWord"
          onChange={this.handleChange}
          value={this.state.wordInput} />
				<button onClick={() => this.handleSyn()}>Synonyms</button>
				<button onClick={() => this.handleRhy()}>Rhymes</button>
				<section className='displayedWords'>
					<h2>{this.state.title}</h2>
          <ul>

            {this.state.words.map((singleWord) => {
              return (
                <li key={singleWord.score} className='wordContainer'>
                  <button value={singleWord.word} onClick={this.addToList}>
                    {singleWord.word}
                  </button>
                </li>
              )
            })}

          </ul>
				</section>

        <section className='poemLists'>
          <ul>
            {this.state.poemLibrary.map ((poem) => {
              console.log(poem);
              return (
								<li key={poem.key}>
									<h2>{poem.key}</h2>

								</li>
							)

            })}
           
          </ul>

        </section>

      
			</div>
		);
	}
}

export default App;

