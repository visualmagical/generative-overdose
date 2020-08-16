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
    const [fav, setFav] = useState({});
    const feedBox = useRef(null);
    const searchBox = useRef(null);
    const COLS = 4;

    useEffect(() => {
        const sendFav = async () => {
            const response = await fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fav }),
            });

            const body = await response.text();
            console.log(body);
        }
        sendFav();
    }, [fav]);

    // useEffect(() => {
    //     const getFav = async () => {
    //         const response = await fetch('favs.json')
    //         const data = await response.json();
    //         console.log('respo', data);
    //     }
    //     getFav();
    // }, [fav])


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
                {feed && feed.map(({ node }) => (
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
                                alt="image"
                            />

                        </a>
                        <button
                            className={st.add}
                            onClick={() => setFav({ display_url: node.display_url, shortcode: node.shortcode })}
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