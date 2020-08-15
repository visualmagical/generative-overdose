import React, {useState, useRef, useLayoutEffect} from 'react';
import Tiles from '../Tiles';
import Logo from '../Logo';
import Nav from '../Nav';
import st from './styles.module.css';

const Header = ({ baseHue, setSelected, whatWentDown }) => {
    const [ h, setH] = useState(0);
    const headerRef = useRef(null);

    useLayoutEffect(() => {
        const height = headerRef.current.getBoundingClientRect().bottom;
        setH(height);
    }, []);
    return (
        <header className={st.header} ref={headerRef}>
            <Tiles h={h} baseHue={baseHue}/>
            <Logo />
            <Nav setWhat={setSelected} whatWentDown={whatWentDown} />
        </header>
    );
}

export default Header;