import React from 'react';
import cn from 'classnames';
import st from './styles.module.css';

const Button = ({
    children,
    onClick,
    baseHue,
    transp,
    w100,
}) => {
    const buttonCss = transp ? ({
        color: `hsl(${baseHue}, 70%, 60%)`,
    }) : ({
        backgroundColor: `hsl(${baseHue}, 70%, 60%)`,
        borderColor: `hsl(${baseHue}, 70%, 60%)`,
    });

    return (
        <button
            className={cn(st.button, {
                [st.transp]: transp,
                [st.w100]: w100,
            })}
            onClick={onClick}
            style={buttonCss}
        >
            {children}
        </button>
    );
}


export default Button;