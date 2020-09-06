import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import st from './styles.module.css';
const modalRoot = document.getElementById('popup');

const Popup = ({ children, handleClose, baseHue }) => {
    const el = document.createElement('div');
    const reserved = useRef(null);

    useEffect(() => {
        modalRoot.appendChild(el);
        return () => modalRoot.removeChild(el);
    })

    useEffect(() => {
        document.addEventListener("click", shouldClose);
        return () => document.removeEventListener("click", shouldClose);
    })

    const shouldClose = e => {
        if (reserved.current.contains(e.target)) return;
        handleClose();
    }

    return ReactDOM.createPortal(
        <div className={st.shadow}>{console.log('rerender')}
            <div
                className={st.popup}
                style={{backgroundColor: `hsl(${baseHue}, 70%, 60%)`}}
                ref={reserved}
            >
                {children}
                <button
                    onClick={handleClose}
                    className={st.close}
                >
                    ✕
                </button>
            </div>

        </div>,
        el
    );
}

export default Popup;