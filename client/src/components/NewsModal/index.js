import React from 'react';
import st from './styles.module.css';
import Button from '../Button';

const NewsModal = ({ baseHue, handleAnswer, title }) => {

    return (
        <div className={st.body}>
            <p className={st.question}>
                {title}
            </p>
            <div className={st.buttonsRow}>
                <Button
                    baseHue={baseHue}
                    onClick={() => handleAnswer("yes")}
                    transp
                    w100
                >
                    yes
                </Button>
                <Button
                    baseHue={baseHue}
                    onClick={() => handleAnswer("no")}
                    transp
                    w100
                >
                    no
                </Button>
                <Button
                    baseHue={baseHue}
                    onClick={() => handleAnswer("idk")}
                    transp
                    w100
                >
                    i don't know
                </Button>
            </div>
        </div>
    );
}

export default NewsModal;