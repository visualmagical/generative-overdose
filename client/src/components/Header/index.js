import React, {useState, useRef, useLayoutEffect} from 'react';
import Tiles from '../Tiles';
import Logo from '../Logo';
import st from './styles.module.css';
import logoSt from '../Logo/styles.module.css'


const Header = ({ baseHue }) => {
    const [ h, setH] = useState(0);
    const [isHeightFound, setIsHeightFound] = useState(false);
    const headerRef = useRef(null);

    useLayoutEffect(() => {
        // not working 😥
        const height = headerRef.current.getBoundingClientRect().bottom;
        setH(height);
    }, [])

    return (
        <header className={st.header}>
            <h1
                ref={headerRef}
                className={logoSt.logo}
                style={{visibility: "hidden", position: "absolute"}}
            >
                generative
                overdose
            </h1>
            <Tiles h={h} baseHue={baseHue}/>
            <Logo />
        </header>
    );
}

export default Header;