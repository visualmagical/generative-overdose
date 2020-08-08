import  React from 'react';
import st from './styles.module.css';

const Logo = () => {
    return (
        <h1 className={st.logoWrap}>
            <span className={st.logoText} >
                generative
                overdose
            </span>
        </h1>
    );
}

export default Logo;