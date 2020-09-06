
import React from 'react';
import st from "./styles.module.css";

// TODO make map instead of repeating list items
const Footer = ({ baseHue }) => (
    <footer
        className={st.footer}
        style={{backgroundColor: `hsl(${baseHue}, 70%, 60%)`}}
    >
        <p>
            <span>{"made with <З by "}</span>
            <a
                href="https://github.com/katia-trifonova"
                rel="noopener noreferrer"
                target="_blank"
                className={st.katia}
            >
                katia
            </a>
        </p>
    </footer>
);


export default Footer;
