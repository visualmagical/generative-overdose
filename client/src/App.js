import React, { useState } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from "./components/Footer";

const App = () => {
    const [baseHue] = useState(Math.round(Math.random() * 360));
    return (
        <div className="app">
            <Header baseHue={baseHue} />
            <Main baseHue={baseHue} />
            <Footer baseHue={baseHue} />
        </div>
    );
}

export default App;
