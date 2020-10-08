import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import firebase from './firebase';
import ToggleDisplay from 'react-toggle-display';

// IMPORTING COMPONENTS
import Header from './Header.js';
import Modal from './Modal.js';
import List from './List.js'
import Footer from './Footer.js';

// App States by default
class App extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      rhymeInput: '',
      synInput: '',
      words: [],
      wordInput: '',
      savedWords: '',
      poemLibrary: [],
      showFormModal: false,
      showDisplayedWords: false,
	    showModal: false,
	    noResultsModal: false,
    };
  }

  // Connection to Firebase, pulling data from firebase and pushing them into new states. 
  componentDidMount() {
    const dbRef = firebase.database().ref(); 

    dbRef.on('value', (response) => {
      const newState = [];
      const data = response.val();

      for (let key in data) {
        const wordObject = data[key];
        const wordArray = [];

        for (let title in wordObject) {
          wordArray.push(wordObject[title]);
        }

        // Push wordArray into listOfWords
        newState.push({
          key: key,  // list Title
          listOfWords: wordArray, // saved words
        });
      }

      // Updating poemLibrary state with newState array
      this.setState({
        poemLibrary: newState,
      });

    });
  }

  // Retrieves synonymn results off API based on user input
  getSyn = () => {
    axios({
      url: 'https://api.datamuse.com/words',
      params: {
        max: 12,
        ml: this.state.synInput,
      },
    }).then((response) => {
      let wordsResults = response.data;
      if (wordsResults.length === 0) {
        this.displayNoResultsModal();
      }
      this.setState({
        words: wordsResults,
        showDisplayedWords: true,
      });
    });
  }

  // Retrieves rhyme results off API based on user input
  getRhy = () => {
    axios({
      url: 'https://api.datamuse.com/words',
      params: {
        max: 12,
        rel_rhy: this.state.rhymeInput,
      },
    }).then((response) => {
      let wordsResults = response.data;
      if (wordsResults.length === 0) {
        this.displayNoResultsModal();
      }
      this.setState({
        words: wordsResults,
        showDisplayedWords: true,
      });
    });
  }
  
  // Logs user input and saves to state
  handleChange = (event) => {
    let wordInput = event.target.value;
    this.setState({
      wordInput,
    });
  }

  // onClick Handle to get list of rhyming words and to place rhyming words in state
  handleRhy = () => {
    this.setState(
      {
        rhymeInput: this.state.wordInput,
        title: this.state.wordInput,
      },
      () => {
        if (this.state.wordInput === '') {
          this.displayFormModal();
        } else {
          this.getRhy();
        }
      }
    );
  }

  // onClick Handle to get list of synonymns and to place these words in state
  handleSyn = () => {
    this.setState(
      {
        synInput: this.state.wordInput,
        title: this.state.wordInput,
      },
      () => {
        if (this.state.wordInput === '') {
          this.displayFormModal();
        } else {
          this.getSyn();
        }
      }
    );
  }

  // Modal Function/Error Handler if API provides no results
  displayNoResultsModal = () => {
    this.setState({
      noResultsModal: !this.state.noResultsModal,
    });
  }

  // Modal Function/Error Handler if text input box is empty
  displayFormModal = () => {
    this.setState({
      showFormModal: !this.state.showFormModal,
    });
  }

  //Modal Function/Error Handler if user selects the same word twice
  toggleModal = (event) => {
    if (this.state.poemLibrary.length > 0) {
      // Mapping through poemLibrary, accessing 'key' property which holds list title, and finding index number
      const listIndex = this.state.poemLibrary.map((list) => list.key).indexOf(this.state.title); 

     // Checking to see if selected word already exists in listOfWords array
      if (listIndex > -1) {
        const checkWords = this.state.poemLibrary[listIndex].listOfWords.includes(event.target.value);

        // If there's a matching word in listOfWords, it call the function that displays modal
        if (checkWords) {
          this.displayModal();

        // If false, it will add word to list
        } else {
          this.addToList(event.target.value);
        }

      } else {
        this.addToList(event.target.value);
      }

    // If list doesn't exist in Firebase, add it
    } else { 
      this.addToList(event.target.value);
    }
  }

  // Adding save words to appropriate title in firebase if the title doesn't exist, it will be added 
  addToList = (value) => {
    const dbRef = firebase.database().ref(this.state.title);
    dbRef.push(value);

    this.setState({
      savedWords: value,
    });
  }

  // Modal Function/Error Handler if user adds the same word twice
  displayModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  // Removing list from Firebase when button is clicked
  handleRemove = (listKey) => {
    const dbRef = firebase.database().ref();
    dbRef.child(listKey).remove();
  }

  render() {
    return (
			<div className='App'>
        
				<Header />

				<main className='wrapper'>

					{/*section that takes in user input*/}
					<section className='form'>
            <h2>Enter A Word</h2>
						<label className='srOnly' htmlFor='chosenWord'>Enter A Word</label>
						<input
							type='text'
							id='chosenWord'
							onChange={this.handleChange}
							value={this.state.wordInput}
							placeholder='Ex: Happy'
						/>
						<h2>What kind of words would you like?</h2>
						<div className='buttonFlex'>
							<button onClick={() => this.handleSyn()}>Synonyms</button>
							<p>or</p>
							<button onClick={() => this.handleRhy()}>Rhymes</button>
						</div>
					</section>

          {/* error handling modal if input is blank when submitted */}
          <ToggleDisplay show={this.state.showFormModal}>
            <Modal
              pTag='Please enter a word and try again!'
              showTheModal={this.displayFormModal}
            />
          </ToggleDisplay>

          {/* error handling modal if API call returns no results */}
          <ToggleDisplay show={this.state.noResultsModal}>
            <Modal
              pTag="Looks like we can't find any results, please try another word!"
              showTheModal={this.displayNoResultsModal}
            />
          </ToggleDisplay>

          {/* error handling modal if user tries to add same word to a list twice */}
          <ToggleDisplay show={this.state.showModal}>
            <Modal
              pTag='Looks like this word has already been added to your list!'
              showTheModal={this.displayModal}
            />
          </ToggleDisplay>

					{/*section where API call results are displayed*/}
					<ToggleDisplay show={this.state.showDisplayedWords}>
						<section className='displayedWords'>
							<h2>{this.state.title}</h2>
							<ul>
								{this.state.words.map((singleWord) => {
									return (
										<li key={singleWord.score}>
											<button
												value={singleWord.word}
												onClick={this.toggleModal}
											>
												{singleWord.word}
											</button>
										</li>
									);
								})}
							</ul>
						</section>
					</ToggleDisplay>

					{/* Display firebase data/saved lists */}
					<section className='poemLists'>
						<ul>
							{/* Accessing poemLibrary array and mapping over it to access saved listOfWords array. Accessing listOfWords array and mapping over it to render individual words in array */}
							{this.state.poemLibrary.map((poem) => {
								const myObject = poem.listOfWords;
								const wordList = myObject.map((word, index) => {
									return (
										<div className='words' key={index}>
											<p>{word}</p>
										</div>
									);
								});
								return (
									// List Component that holds our words that are stored in Firebase
									<List
										key={poem.key}
										title={poem.key}
										list={wordList}
										listKey={poem.key}
										removeHandle={this.handleRemove}
									/>
								);
							})}
						</ul>
					</section>
				</main>

				<Footer />

			</div>
		);
  }
}

export default App;

