import './App.scss';
import { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Scene } from './components/Scene';

const App = () => {
	useEffect(() => {
		if (window.location.pathname === '/') {
			window.location.replace('/app');
		}
	}, []);

	return (
		<>
			<CssBaseline />
			<Scene/>
		</>
	);
};

export default App;
