import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const exit = <FontAwesomeIcon icon={faTimes} />;


class List extends React.Component {

        callRemove = () => {
            this.props.removeHandle(this.props.title)
        }
    render() {
        return (
            
            <li key={this.props.listKey}>
                <button className="removeList" title='remove' onClick={this.callRemove}>
                <span className='srOnly'>
                        Delete this list by clicking here.
				        </span>{exit}</button>
                
                <h3>{this.props.title}</h3>

                
                {this.props.list}
                
            </li>
        )
    }
}

export default List;