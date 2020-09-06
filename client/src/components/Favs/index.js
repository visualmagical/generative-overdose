import React, { useEffect, useState } from 'react';
import Preloader from '../Preloader';
import st from "./styles.module.css";
import Popup from "../Popup";
import NewsModal from "../NewsModal";



const Favs = ({ baseHue }) => {
    const [isWaiting, setIsWaiting] = useState(false)
    const [favvs, setFavvs] = useState([]);
    const [weirdFav, setWeirdFav] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [removeWeirdFav, setRemoveWeirdFav] = useState(false);
    // const COLS = 4;

    const rmBtnCss = {
        backgroundColor: `hsl(${baseHue}, 70%, 60%)`
    }

    useEffect(() => {
        const getFavs = async () => {
            setIsWaiting(true);
            const jsondata = await fetch('/api/get-favs')
            const data = await jsondata.json();
            const favsReversed = await data.nodes?.reverse()

            const promises = favsReversed.map( f => {
                return fetch('/api/fav-images', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ shortcode: f.shortcode }),
                })
                    .then(imgdata => imgdata.blob())
                    .then(image => URL.createObjectURL(image))
                    .then(src =>({
                        shortcode: f.shortcode,
                        display_url: f.display_url,
                        src,
                    }))
            })

            // TODO find out how to update state asynchronously
            // const ary = []
            // const mapped = favsReversed.map( async f => {
            //     const fetched = await fetch('/api/fav-images', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({shortcode: f.shortcode}),
            //     })
            //     const data = await fetched.blob();
            //     const src = await URL.createObjectURL(data);
            //     const cleanObject = {
            //         shortcode: f.shortcode,
            //         display_url: f.display_url,
            //         src,
            //     }
            //     await ary.push(cleanObject)
            //     await setFavvs(ary)
            //     return cleanObject;
            // })


            Promise.all(promises).then(res => {
                setFavvs(res);
                setIsWaiting(false);
            })
        }
        getFavs();
    }, [])

    useEffect(() => {
        const removeFav = async () => {
            const response = await fetch('/api/remove-fav', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({fav: weirdFav}),
            });
            // const data = await response.json();
            // setFavs(data.nodes?.reverse());
            const newFavvs = [...favvs.filter(f => (weirdFav.shortcode !== f.shortcode))]
            setFavvs(newFavvs);
        }
        if (removeWeirdFav && weirdFav) {
            removeFav();
            setRemoveWeirdFav(false);
            setWeirdFav(null);
        }
    }, [removeWeirdFav, weirdFav, favvs])

    const handleModalAnswer = answer => {
        if (answer === "yes") setRemoveWeirdFav(true);
        if (answer === "idk" && Math.random() > 0.5) setRemoveWeirdFav(true);
        setIsPopupOpen(false);
    }

    const handleRemoveFav = favObj => {
        setWeirdFav(favObj);
        setIsPopupOpen(true);
    }

    return (
        <div className={st.instagram}>
            {isPopupOpen && (
                <Popup
                    handleClose={() => setIsPopupOpen(false)}
                    baseHue={baseHue}
                >
                    <NewsModal
                        baseHue={baseHue}
                        title="remove this image?"
                        handleAnswer={handleModalAnswer}
                    />
                </Popup>
            )}
            {isWaiting ? (
                <Preloader baseHue={baseHue} />
            ) : (
                <div
                    className={st.feed}
                >
                    {favvs?.length > 0 && favvs.map(node => (
                        <div
                            className={st.wrap}
                            key={node.shortcode}
                        >
                            <a
                                className={st.item}
                                href={`https://www.instagram.com/p/${node.shortcode}/`}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    className={st.image}
                                    src={node.src}
                                    alt={node.shortcode}
                                />

                            </a>
                            <button
                                className={st.add}
                                style={rmBtnCss}
                                onClick={() => handleRemoveFav({shortcode: node.shortcode})}
                            >
                                ✕
                            </button>
                        </div>


                    ))}
                </div>
            )}
        </div>
    );
}

export default Favs;