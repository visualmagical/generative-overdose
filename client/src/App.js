import React, { useState } from 'react';
import Header from './components/Header';
import Main from './components/Main';

const App = () => {
    const [baseHue] = useState(Math.round(Math.random() * 360));
    return (
        <div className="App">{console.log('rerender')}
            <Header baseHue={baseHue} />
            <Main baseHue={baseHue} />
        </div>
    );
}

export default App;
