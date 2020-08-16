
import React from 'react';
import cn from 'classnames';
import st from "./styles.module.css";
import Header from "../Header";

// TODO make map instead of repeating list items
const Nav = ({ setWhat, whatWentDown, baseHue }) => (
    <nav className={st.nav}>{console.log(whatWentDown)}
        <ul className={st.linksList}>
            <li className={st.li}>
                <button
                    onClick={() => setWhat('news')}
                    className={cn({[st.notSelected]: whatWentDown !== 'news'})}
                    style={{backgroundColor: `hsl(${baseHue}, 70%, 60%)`}}
                >
                    news
                </button>
            </li>
            <li className={st.li}>
                <button
                    onClick={() => setWhat('instagram')}
                    className={cn({[st.notSelected]: whatWentDown !== 'instagram'})}
                    style={{backgroundColor: `hsl(${baseHue}, 70%, 60%)`}}
                >
                    instagram
                </button>
            </li>

            <li className={st.li}>
                <button
                    onClick={() => console.log('привет')}
                    className={cn({[st.notSelected]: whatWentDown !== 'openprocessing'})}
                    style={{backgroundColor: `hsl(${baseHue}, 70%, 60%)`}}
                >
                    open processing
                </button>
            </li>

            <li className={st.li}>
                <button
                    onClick={() => console.log('привет')}
                    className={cn({[st.notSelected]: whatWentDown !== 'awesomeness'})}
                    style={{backgroundColor: `hsl(${baseHue}, 70%, 60%)`}}
                >
                    awesomeness
                </button>
            </li>
        </ul>
    </nav>
);

export default Nav;