import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<div>
			<Link to='/format-counter'>
				<button>Подсчет форматов А4</button>
			</Link>
			<Link to='/draw-check'>
				<button>Проверка чертежей</button>
			</Link>
		</div>
	);
};

export default Home;
