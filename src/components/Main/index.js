
import React, { useEffect, useState } from 'react';
import st from "./styles.module.css";

import Parser from 'rss-parser';
let parser = new Parser();


function Main() {
    const [colossal, setColossal] = useState('');

    useEffect(() => {
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

        parser.parseURL(CORS_PROXY + 'https://www.thisiscolossal.com/feed/', function(err, feed) {
            if (err) throw err;
            setColossal(feed.items);
        })

    }, []);

    return (
        <main className={st.main}>

            <ul>
                {colossal && colossal.map(c => {
                    const createMarkup = () => ({__html: c['content:encoded']})
                    return(
                        <li key={c.pubDate}>
                            {c.title}
                            {c.pubDate}
                            <div dangerouslySetInnerHTML={createMarkup()} />
                            {/*{c.description}*/}
                        </li>
                    )
                })}
            </ul>


        </main>
    );
}

export default Main;
