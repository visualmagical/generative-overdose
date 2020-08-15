
import React from 'react';
import cn from 'classnames';
import st from "./styles.module.css";

// TODO make map instead of repeating list items
const Nav = ({ setWhat, whatWentDown }) => (
    <nav className={st.nav}>{console.log(whatWentDown)}
        <ul className={st.linksList}>
            <li className={st.li}>
                <button
                    onClick={() => setWhat('news')}
                    className={cn({[st.selected]: whatWentDown === 'news'})}
                >
                    news
                </button>
            </li>
            <li className={st.li}>
                <button
                    onClick={() => setWhat('instagram')}
                    className={cn({[st.selected]: whatWentDown === 'instagram'})}
                >
                    instagram
                </button>
            </li>

            <li className={st.li}>
                <button
                    onClick={() => console.log('привет')}
                    className={cn({[st.selected]: whatWentDown === 'openprocessing'})}
                >
                    open processing
                </button>
            </li>

            <li className={st.li}>
                <button
                    onClick={() => console.log('привет')}
                    className={cn({[st.selected]: whatWentDown === 'awesomeness'})}
                >
                    awesomeness
                </button>
            </li>
        </ul>
    </nav>
);

export default Nav;
