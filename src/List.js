import React from 'react';

// FONT AWESOME ICON
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
const exit = <FontAwesomeIcon icon={faTimes} />;


class List extends React.Component {

    // callRemove function is passing a prop that removes the list via removeHandle in the App.js component
    callRemove = () => {
        this.props.removeHandle(this.props.title)
    }

    render() {
        return (
            <li key={this.props.listKey}>

                <h3>{this.props.title}</h3>
                {this.props.list}
                <button
                    className='removeList'
                    title='remove'
                    onClick={this.callRemove}
                >
                    <span className='srOnly'>Delete this list by clicking here.</span>
                    {exit}
                </button>

            </li>
		);
    }
}

export default List;