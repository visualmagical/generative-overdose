import React, { useEffect, useState, useRef } from 'react';
import { useDebounce } from '../../tools/debounce';
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

const Instagram = ({ baseHue }) => {
    const [feed, setFeed] = useState([]);
    const [isMore, setIsMore] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [inputInvalid, setInputInvalid] = useState(false);

    const [isNewTag, setIsNewTag] = useState(false);
    const [input, setInput] = useState('');
    const [tag, setTag] = useState('generativeart');
    const [newFav, setNewFav] = useState(null);
    const feedBox = useRef(null);
    const searchBox = useRef(null);
    const COLS = 4;
    const debouncedSearchTerm = useDebounce(input, 700)
    const inputCss = {
        borderColor: `hsl(${baseHue}, 70%, 60%)`,
        color: `hsl(${baseHue}, 70%, 60%)`,
    };
    const hashCss = {
        color: `hsl(${baseHue}, 70%, 60%)`,
    };
    const buttonCss = {
        backgroundColor: `hsl(${baseHue}, 70%, 60%)`,
        borderColor: `hsl(${baseHue}, 70%, 60%)`,
    };


    const updateTag = value => {
        setIsWaiting(true)
        setInput(value.trim())
    }

    useEffect(() => {

        if (debouncedSearchTerm) {
            const regex = /^[A-Za-z0-9]+$/
            const isValid = regex.test(debouncedSearchTerm);
            if (isValid) {
                setTag(debouncedSearchTerm)
                setIsNewTag(true)
            } else {
                setIsWaiting(false)
                setInputInvalid(true)
            }
        } else {
            setIsWaiting(false)
        }
    }, [debouncedSearchTerm])

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
            const maxIdSuffix = (feed.length > 1 && isMore) ? `&max_id=${feed[feed.length - 1].node.id}` : '';
            const raw = await fetch(`https://www.instagram.com/explore/tags/${tag}/?__a=1${maxIdSuffix}`);
            const data = await raw.json();
            const nodes = data.graphql.hashtag.edge_hashtag_to_media.edges;
            let next;
            if (isNewTag) {
                next = uniqBy([...nodes], it => (it.node.id));
                setIsNewTag(false)
            } else {
                next = uniqBy([...feed, ...nodes], it => (it.node.id)); // remove duplets
            }
            const cropped = sliceByCols([...next], COLS);
            setFeed(cropped);
            if (isMore) {
                window.scrollTo( 0, offSet);
                setIsMore(false);
            }
        }
        getFeed();
    }, [isMore, tag]);

    return (
        <div className={st.instagram}>
            <div
                className={st.inputWrap}
                ref={searchBox}
                style={inputCss}
            >
                <input
                    className={st.input}
                    style={inputCss}
                    autoFocus
                    type="text"
                    defaultValue={tag}
                    onChange={({ target }) => updateTag(target.value)}
                />
                <span
                    className={st.hash}
                    style={hashCss}
                >
                    #
                </span>
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
                style={buttonCss}
                className={st.more}
                onClick={() => setIsMore(true)}
            >
                more
            </button>
        </div>
    );
}

export default Instagram;