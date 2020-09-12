import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import st from './styles.module.css';
const tooltipRoot = document.getElementById('tooltip');

const Tooltip = ({ baseHue, children }) => {
    const el = document.createElement('div');

    useEffect(() => {
        tooltipRoot.appendChild(el);
        return () => tooltipRoot.removeChild(el);
    })


    return ReactDOM.createPortal(
        <div className={st.tooltip} style={{backgroundColor: `hsl(${baseHue}, 70%, 60%)`}}>
            {children}
        </div>,
        el
    );
}

export default Tooltip;