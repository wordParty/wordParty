import React, { Component } from 'react'

class Form extends Component {
    constructor() {
        super();
        this.state = {
            wordInput: '',
            wordType: 'rhymingWord'
        }
    }

    //get wordInput and update the wordInput state
    handleChange = (event) =>  {
        let wordInput = event.target.value;
        this.setState ({
            wordInput
        }
        )
}

    handleSelection = (event) => {
        let wordType = event.target.id
        this.setState({
            wordType
        }
        );
    }

    // connection to firebase/API
    handleClick = (event) => {
        event.preventDefault();
        console.log(event);
        this.setState({
            wordInput: ''
        });
    }
    render() {
        return (
            <div className="form">
                <form action="submit">

                    <label htmlFor="chosenWord">Enter A Word</label>

                    <input 
                    type="text" 
                    id="chosenWord" 
                    onChange={this.handleChange} 
                    value={this.state.wordInput}/>

                    <label htmlFor="rhymingWord">Rhyming Word</label>

                    <input 
                    type="radio" 
                    name="rhymeType" 
                    id="rhymingWord"
                    checked="checked"
                    onChange={this.handleSelection}
                    value={this.state.wordType}/>

                    <label htmlFor="similarWord">Chosen Word</label>

                    <input 
                    type="radio" 
                    name="rhymeType" 
                    id="similarWord" 
                    onChange={this.handleSelection}
                    value={this.state.wordType}/>

                    <button onClick={this.handleClick}>Join The Party</button>
                </form>
            </div>
        )
    }
}

export default Form;