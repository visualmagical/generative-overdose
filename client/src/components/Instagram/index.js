import React, { useEffect, useState, useRef } from 'react';
import st from "./styles.module.css";

const uniqBy = (ary, key) => {
    let seen = new Set();
    return ary.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

const sliceByCols = (ary, cols) => {
    const len = ary.length;
    const remainder = ary.length % cols;
    return ary.slice(0, len - remainder);
}

const Instagram = () => {
    const [feed, setFeed] = useState([]);
    const [isMore, setIsMore] = useState(false);
    const [tag, setTag] = useState('generativeart');
    const [newFav, setNewFav] = useState(null);
    const feedBox = useRef(null);
    const searchBox = useRef(null);
    const COLS = 4;

    useEffect(() => {
        const sendNewFav = async () => {
            const response = await fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fav: newFav }),
            });

            // const body = await response.text();
            // console.log(body);
        }
        if (newFav) sendNewFav();
    }, [newFav]);

    useEffect(() => {
        const getFeed = async () => {
            const offSet = window.pageYOffset;
            const maxIdSuffix = feed.length > 1 ? `&max_id=${feed[feed.length - 1].node.id}` : '';
            const raw = await fetch(`https://www.instagram.com/explore/tags/${tag}/?__a=1${maxIdSuffix}`);
            const data = await raw.json();
            const nodes = data.graphql.hashtag.edge_hashtag_to_media.edges;
            const next = uniqBy([...feed, ...nodes], it => (it.node.id)); // remove duplets
            const cropped = sliceByCols([...next], COLS);
            setFeed(cropped);
            if (isMore) {
                window.scrollTo( 0, offSet);
                setIsMore(false);
            }
        }
        getFeed();

    }, [isMore]);

    return (
        <div className={st.instagram}>
            <div
                className={st.search}
                ref={searchBox}
            >
                <input
                    type="text"
                    onChange={({ target }) => setTag(target.value)}
                />
            </div>
            <div
                className={st.feed}
                ref={feedBox}
            >
                {feed.length > 0 && feed.map(({ node }) => (
                    <div
                        className={st.wrap}
                        key={node.id}
                    >
                        <a
                            className={st.item}
                            href={`https://www.instagram.com/p/${node.shortcode}/`}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <img
                                className={st.image}
                                src={node.display_url}
                                alt={node.shortcode}
                            />

                        </a>
                        <button
                            className={st.add}
                            onClick={() => setNewFav({ display_url: node.display_url, shortcode: node.shortcode })}
                        >
                            +
                        </button>
                    </div>

                ))}
            </div>
            <button
                onClick={() => setIsMore(true)}
            >
                more
            </button>
        </div>
    );
}

export default Instagram;