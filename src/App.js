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
const exit = <FontAwesomeIcon icon={faTimes} />;

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
			showModal: false,
		};
	}

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

				newState.push({
					key: key,
					listOfWords: wordArray,
				});
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
			url: 'https://api.datamuse.com/words',
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
			url: 'https://api.datamuse.com/words',
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
				if (this.state.wordInput === '') {
					this.displayFormModal();
				} else {
					this.getRhy();
				}
			}
		);
	};

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
	};

	displayFormModal = () => {
		this.setState({
			showFormModal: !this.state.showFormModal,
		});
	};

	toggleModal = (event) => {

		if (this.state.poemLibrary.length > 0) {
		
			const listIndex = this.state.poemLibrary.map((list)=> list.key).indexOf(this.state.title);
		
			if (listIndex > -1){
				const checkWords = this.state.poemLibrary[listIndex].listOfWords.includes(event.target.value);
			
				if (checkWords) {
					this.displayModal(); 
				} else {
					this.addToList(event.target.value);
				}
			} else {
				this.addToList(event.target.value);
			}

		} else {
			this.addToList(event.target.value);
		}
	};

	addToList = (value) => {
		const dbRef = firebase.database().ref(this.state.title);
		dbRef.push(value);

		this.setState({
			savedWords: value,
		});
	};


	displayModal = () => {
		this.setState({
			showModal: !this.state.showModal,
		});
	};

	render() {
		return (
			<div className='App'>

				<Header />

				<main className='wrapper'>
					{/* error handling modal if user tries to add same word to a list twice */}
					<ToggleDisplay show={this.state.showModal}>
						<div className='modal'>
							<div className='modalContent'>
								<h3>Oops!</h3>
								<p>Looks like this word has already been added to your list!</p>
								<button className='closeModal' onClick={this.displayModal}>
									<span className='srOnly'>
										Close this pop-up modal by clicking here.
									</span>
									{exit}
								</button>
							</div>
						</div>
					</ToggleDisplay>

					{/* error handling modal if input is blank when submitted */}
					<ToggleDisplay show={this.state.showFormModal}>
						<div className='modal'>
							<div className='modalContent'>
								<h3>Oops!</h3>
								<p>Please enter a word and try again!</p>
								<button className='closeModal' onClick={this.displayFormModal}>
									<span className='srOnly'>
										Close this pop-up modal by clicking here.
									</span>
									{exit}
								</button>
							</div>
						</div>
					</ToggleDisplay>

					<section className='form'>
						<label htmlFor='chosenWord'>Enter A Word</label>
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

					<section className='displayedWords'>
						<h2>{this.state.title}</h2>
						<ul>
							{this.state.words.map((singleWord) => {
								return (
									<li key={singleWord.score} className='wordContainer'>
										<button value={singleWord.word} onClick={this.toggleModal}>
											{singleWord.word}
										</button>
									</li>
								);
							})}
						</ul>
					</section>

					<section className='poemLists'>
						<ul>
							{this.state.poemLibrary.map((poem) => {
								const myObject = poem.listOfWords;

								const wordList = myObject.map((word, index) => {
									return (
										<div className='words' key={index}>
											<p>{word}</p>

											<button className='removeWord' title='remove'>
												<span className='srOnly'>
													Delete this word by clicking here.
												</span>

												{trashCan}
											</button>
										</div>
									);
								});

								return (
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

