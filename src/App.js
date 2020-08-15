import React, { useState } from 'react';
import Header from './components/Header';
import Main from './components/Main';

const App = () => {
    const [selected, setSelected] = useState('news');
    const baseHue = Math.round(Math.random() * 360);
    return (
        <div className="App">
            <Header
                baseHue={baseHue}
                setSelected={setSelected}
                whatWentDown={selected}
            />
            <Main whatWentDown={selected} />
        </div>
    );
}

export default App;
