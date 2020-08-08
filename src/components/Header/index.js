import React, {useState, useRef, useLayoutEffect} from 'react';
import Tiles from '../Tiles';
import Logo from '../Logo';
import Nav from '../Nav';
import st from './styles.module.css';

function Header() {
    const [ h, setH] = useState(0);
    const headerRef = useRef(null);

    useLayoutEffect(() => {
        const height = headerRef.current.getBoundingClientRect().bottom;
        // console.log(headerRef.current.getBoundingClientRect());
        setH(height);
    }, []);
    return (
        <header className={st.header} ref={headerRef}>
            <Tiles h={h} />
            <Logo />
            <Nav />
        </header>
    );
}

export default Header;