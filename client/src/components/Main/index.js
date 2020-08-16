import React, {useState} from 'react';
import News from '../News';
import Instagram from '../Instagram';
import Nav from "../Nav";

const Main = ({ baseHue }) => {
    const [selected, setSelected] = useState('instagram');

    return (
        <div>
            <Nav setWhat={setSelected} whatWentDown={selected} baseHue={baseHue} />
            <main>
                {selected === 'news' && (
                    <News baseHue={baseHue} />
                )}
                {selected === 'instagram' && (
                    <Instagram />
                )}
            </main>
        </div>
    );
}

export default Main;
