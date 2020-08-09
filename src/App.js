import React from 'react';
import Header from './components/Header';
import Main from './components/Main';

const App = () => {
    const baseHue = Math.round(Math.random() * 360);
    return (
        <div className="App">
            <Header baseHue={baseHue} />
            <Main baseHue={baseHue} />
        </div>
    );
}

export default App;
