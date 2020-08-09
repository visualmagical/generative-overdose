
import React from 'react';
import st from "./styles.module.css";

const Article = ({
    description,
    title,
    date,
    link,
    hue,
 }) => {
    const delta = 50 - Math.round(Math.random() * 100);
    const s = 100 - Math.round(Math.random() * 20); // from 80 to 100
    const l = 90 - Math.round(Math.random() * 40); // from 30 to 70



    const css = { backgroundColor: `hsl(${hue + delta}, 70%, 60%)`};

    return (
        <article className={st.article}>
            <a
                className={st.link}
                href={link}
                style={css}
            >
                {title}
            </a>
            <p className={st.article}>{date}</p>
            <p  className={st.description} dangerouslySetInnerHTML={description}></p>
        </article>
    );
}

export default Article;
