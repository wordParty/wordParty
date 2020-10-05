import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const exit = <FontAwesomeIcon icon={faTimes} />;

//TODO maybe can be a functional component?
class List extends React.Component {
    render() {
        return (
            <li key={this.props.title}>
                <button>{exit}</button>
                <h3>{this.props.title}</h3>
            
                {this.props.list}
                
            </li>
        )
    }
}

export default List;