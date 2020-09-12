import React, { useEffect, useState, useRef } from 'react';
import { useDebounce } from '../../tools/debounce';
import Preloader from '../Preloader';
import st from "./styles.module.css";
import cn from 'classnames';

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

const artists = [
    'kgolid',
    'iso.hedron',
    'shedrawswithcode',
    'juanrg92',
    'andrewjamesart',
    'thejohnharman',
    'georgehenryrowe',
    'dmitricherniak',
    'mattdesl_art',
    'lejeunerenard',
    'tylerxhobbs',
    'jnntnnr',
    'makecodenotart',
    'lastrea_',
    'chromasfera',
    'okazzsp',
    'thirdvision.co',
    'zenwebb',
    'feamonkey',
    'mrprudence',
    'polyhop',
    'holgerlippmann',
    'creativedrought',
    'nlgenerative',
    'generated.xyz',
    'des_r_clarke',
    'nervous.system',
    'soficrespo91',
    'jacobvanloon',
    'jessieandkatey',
    'revdancatt',
    'nonzeroexitcode',
    // 'shagey_',
    // 'maxcoopermax',
    // 'georgerowe',
].sort();

const Instagram = ({ baseHue }) => {
    const [feed, setFeed] = useState([]);
    const [isMore, setIsMore] = useState(false);
    const [showMoreBtn, setShowMoreBtn] = useState(true);
    const [isWaiting, setIsWaiting] = useState(true);
    const [inputInvalid, setInputInvalid] = useState(false);
    const [displayByHash, setDisplayByHash] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(artists[0]);
    // const [isAccessErr, setIsAccessErr] = useState(false);
    // const [isUndefPage, setIsUndefPage] = useState(false);
    const [triggerMore, setTriggerMore] = useState(1);


    const [userInfo, setUserInfo] = useState(null);


    const [isNewTerm, setIsNewTerm] = useState(false);
    const [input, setInput] = useState('generativeart');
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

    const addBtnCss = {
        backgroundColor: `hsl(${baseHue}, 70%, 60%)`
    };


    const updateTag = value => {
        setIsWaiting(true);
        setInput(value.trim());
    }

    const updateArtist = value => {
        setIsWaiting(true);
        setIsNewTerm(true);
        setSelectedArtist(value.trim());
        setUserInfo(null);
    }

    const onTermSwitch = () => {
        setIsWaiting(true);
        setIsNewTerm(true);
        setDisplayByHash(!displayByHash);
        setUserInfo(null);
    }

    useEffect(() => {
        if (debouncedSearchTerm.length > 0) {
            const regex = /^[A-Za-z0-9]+$/
            const isValid = regex.test(debouncedSearchTerm);
            if (isValid) {
                setTag(debouncedSearchTerm)
                setIsNewTerm(true)
            } else {
                setIsWaiting(false)
                setInputInvalid(true)
                console.log('INPUT INVALID')
            }
        } else {
            console.log('NO TERM INVALID')
            setInputInvalid(true);
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
        }
        if (newFav) sendNewFav();
    }, [newFav]);

    useEffect(() => {
        const getFeed = async () => {
            const offSet = window.pageYOffset;
            const maxIdSuffix = (feed.length > 1 && isMore) ? `&max_id=${feed[feed.length - 1].id}` : '';
            let raw, data, nodes, next;
            if (!isMore) setIsWaiting(true);
            const favsdata = await fetch('/api/get-favs')
            const favsnodes = await favsdata.json();
            const favs = favsnodes.nodes;

            if (displayByHash) {
                try {
                    raw = await fetch(`https://www.instagram.com/explore/tags/${tag}/?__a=1${maxIdSuffix}`);
                    data = await raw.json();
                    nodes = data.graphql?.hashtag.edge_hashtag_to_media.edges.map(({ node }) => node) || [];
                } catch (error) {
                    console.log(error)
                    nodes = [];
                }
            } else {
                const rawId = await fetch(`https://www.instagram.com/${selectedArtist}/?__a=1`);
                const parsed = await rawId.json();

                if (!parsed.graphql) {
                    console.log('PAGE UNDEFINED')
                    // setIsUndefPage(true);
                    // setTimeout(() => setIsUndefPage(false), 3000)
                    return;
                }
                const userid = parsed.graphql.user.id;
                raw = await fetch(`https://www.instagram.com/graphql/query/?query_id=17888483320059182&id=${userid}&first=12${userInfo?.end_cursor ? '&after=' + userInfo.end_cursor : ''}`)

                data = await raw.json();

                nodes = data?.data?.user.edge_owner_to_timeline_media.edges.map(({ node }) => node) || [];
                if (nodes.length < 12) {
                    setShowMoreBtn(false);
                } else {
                    setShowMoreBtn(true);
                }
                if (nodes.length < 1) {
                    console.log('PRIVATE ACCOUNT')
                    setIsWaiting(false);
                    // setIsAccessErr(true);
                    // setTimeout(() => setIsAccessErr(false), 3000)
                    return;
                }
                setUserInfo(data.data.user.edge_owner_to_timeline_media.page_info)
            }

            if (isNewTerm) {
                next = uniqBy([...nodes], it => (it.id));
                setIsNewTerm(false)
            } else {
                next = uniqBy([...feed, ...nodes], it => (it.id)); // remove duplets
            }

            // TODO refactor these weird conditions if possible
            if (
                (displayByHash && !isNewTerm && next.length === feed.length)
                || (displayByHash && next.length < 12)
            ) {
                setShowMoreBtn(false);
            } else if (displayByHash) {
                setShowMoreBtn(true);
            }
            const cropped = displayByHash && nodes.length > 12 ? sliceByCols([...next], COLS) : next;
            const checkedFav = cropped.map(node => {
                const isFav = favs.find(fav => (
                    fav.shortcode === node.shortcode
                ))
                if (isFav) return Object.assign(node, { isFav: true })
                return Object.assign(node, { isFav: false })
            })
            setFeed(checkedFav);

            if (isMore) {
                window.scrollTo( 0, offSet);
                setIsMore(false);
            }
            setIsWaiting(false);
        }
        getFeed();
    }, [triggerMore, tag, selectedArtist, displayByHash]);
    // }, [triggerMore, tag, selectedArtist, displayByHash, feed, isMore, isNewTerm, userInfo]);

    return (
            <div className={st.instagram}>
                <div className={st.topControls}>
                    <button
                        style={buttonCss}
                        className={st.switcher}
                        onClick={() => onTermSwitch()}
                    >
                        switch to {displayByHash ? 'username' : 'hashtag'}
                    </button>

                    {/*{isAccessErr && (<span>PRIVATE ACCOUNT</span>)}*/}
                    {/*{isUndefPage && (<span>PAGE UNDEFINED</span>)}*/}

                    {displayByHash ? (
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
                    ) : (
                        <>
                            <select
                                className={st.select}
                                style={inputCss}
                                name="artists"
                                id="artists"
                                autoFocus
                                onChange={({ target }) => updateArtist(target.value)}
                            >
                                {artists.map(a => (
                                    <option key={a}>{a}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
                {isWaiting ? (
                    <Preloader baseHue={baseHue} />
                ) : (
                    <>
                        <div
                            className={st.feed}
                            ref={feedBox}
                        >
                            {feed.length > 0 ? feed.map(node => (
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
                                        title="add to awesomeness"
                                        style={addBtnCss}
                                        className={cn([st.add], {[st.fav]: node.isFav})}
                                        onClick={() => {
                                            node.isFav = true;
                                            setNewFav({
                                                display_url: node.display_url,
                                                shortcode: node.shortcode
                                            })
                                        }}
                                    >
                                        {node.isFav ? <span>✓︎</span> : <span>+</span>}
                                    </button>

                                </div>

                            )) : (
                                <span>NO RESULTS</span>
                            )}
                        </div>
                        {showMoreBtn && (
                            <button
                                style={buttonCss}
                                className={st.more}
                                onClick={() => {
                                    setIsMore(true);
                                    setTriggerMore(Math.random());
                                    // setIsMore(false);
                                }}
                            >
                                more
                            </button>
                        )}
                    </>
                )}
            </div>

    );
}

export default Instagram;