import React from 'react';

// FONT AWESOME ICON
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const exit = <FontAwesomeIcon icon={faTimes} />;

class Modal extends React.Component {

	// callModal function is passing a prop that call the modal in the App.js component
	callModal = () => {
		this.props.showTheModal();
	};

	render() {
		return (
			<div className='modal'>
				<div className='modalContent'>
					<h3>Oops!</h3>
					<p>{this.props.pTag}</p>
					<button className='closeModal' onClick={this.callModal}>
						<span className='srOnly'>
							Close this pop-up modal by clicking here.
						</span>
						{exit}
					</button>
				</div>
			</div>
		);
	}
}

export default Modal;

