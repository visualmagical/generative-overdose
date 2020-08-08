
import React from 'react';
import st from "./styles.module.css";

const Nav = () => {
    return (
        <nav className={st.nav}>
            <ul className={st.linksList}>
                <li className={st.li}>articles</li>
                <li className={st.li}>instagram</li>
                <li className={st.li}>twitter</li>
            </ul>
        </nav>
    );
}

export default Nav;
