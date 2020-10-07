import React, { Component } from 'react'

class Footer extends Component {
    render() {
        return (
            <footer>
                <p>
                    Created at <a href='https://junocollege.com/'>Juno College</a> by:
                </p>
                <p>
                    <a href='https://github.com/thomasDotOnline'>Thomas</a>,{' '} 
                    <a href='https://github.com/bksokhi'>Baljit</a>,{' '} 
                    <a href='https://github.com/hshaikhnbake'>Haris</a>, and{' '} 
                    <a href='https://github.com/aprillebalsom'>Aprille</a>
                </p>
            </footer>
        );
    }
}

export default Footer;
