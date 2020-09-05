
import React from 'react';
import st from "./styles.module.css";

const Article = ({
    title,
    date,
    link,
    hue,
    keywords,
    source,
    image,
 }) => {
    const delta = 50 - Math.round(Math.random() * 100);
    // const s = 100 - Math.round(Math.random() * 20); // from 80 to 100
    // const l = 90 - Math.round(Math.random() * 40); // from 30 to 70

    const titleCss = { backgroundColor: `hsl(${hue + delta}, 70%, 60%)`};
    const keywordCss = { borderColor: `hsl(${hue + delta}, 70%, 60%)`};
    const sourceCss = { color: `hsl(${hue + delta}, 70%, 60%)`};

    return (
        <article className={st.article}>
            <a
                rel='noreferrer noopener'
                target='_blank'
                className={st.link}
                href={link}
            >
                <h2
                    className={st.title}
                    style={titleCss}
                >
                    {title}
                </h2>

                {image && (
                    <div className={st.imageWrap}>
                        <img src={image} alt="kek"/>
                    </div>
                )}

                <ul className={st.keywords}>
                    {keywords && keywords.map(word => (
                        <li
                            style={keywordCss}
                            className={st.word}
                            key={word}
                        >
                            {word}
                        </li>
                    ))}
                </ul>

                <p className={st.textLine} >
                    <span className={st.source} style={sourceCss}>
                        {source}
                    </span>
                    <span className={st.date}>
                        {date}
                    </span>
                </p>
            </a>
        </article>
    );
}

export default Article;
