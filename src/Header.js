import React from 'react';

const Header = () => {
	return (
		<header>
			<div className="wrapper headerFlex">
                <h1>Word Party</h1>
                {/* TODO may not need class */}
                <p className='tagLine'>Expand your vocabulary and create rhyming schemes with Word Party</p>
            </div>
		</header>
	);
};

export default Header;
