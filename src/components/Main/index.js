import React from 'react';
import News from '../News';
import Instagram from '../Instagram';

const Main = ({ whatWentDown }) => {
    const baseHue = Math.round(Math.random() * 360);
    return (
        <div>
            {whatWentDown === 'news' && (
                <News baseHue={baseHue} />
            )}
            {whatWentDown === 'instagram' && (
                <Instagram />
            )}
        </div>
    );
}

export default Main;
