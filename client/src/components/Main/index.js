import React, {useState} from 'react';
import News from '../News';
import Instagram from '../Instagram';
import Nav from "../Nav";
import Favs from "../Favs";

const Main = ({ baseHue }) => {
    const [selected, setSelected] = useState('news');

    return (
        <div style={{flex: "1 0 auto"}}>
            <Nav setWhat={setSelected} whatWentDown={selected} baseHue={baseHue} />
            <main>
                {selected === 'news' && (
                    <News baseHue={baseHue} />
                )}
                {selected === 'instagram' && (
                    <Instagram baseHue={baseHue} />
                )}
                {selected === 'awesomeness' && (
                    <Favs baseHue={baseHue} />
                )}
            </main>
        </div>
    );
}

export default Main;
