import './App.scss';
import { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

function App() {
	useEffect(() => {
		if (window.location.pathname === '/') {
			window.location.replace('/app');
		}
	}, []);

	return (
		<>
			<CssBaseline />
			<BrowserRouter basename='app'>
				<nav>
					<Link to='/'> Home </Link>
					<Link to='/settings'> Settings </Link>
				</nav>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='settings' element={<SettingsPage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

function SettingsPage() {
	return (
		<div>
			<h1> Settings </h1>
		</div>
	);
}

function HomePage() {
	return (
		<div>
			<h1> Home </h1>
		</div>
	);
}

export default App;
