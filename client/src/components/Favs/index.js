import React, { useEffect, useState } from 'react';
import st from "./styles.module.css";



const Favs = () => {
    const [favs, setFavs] = useState([]);
    const [favvs, setFavvs] = useState([]);
    const [weirdFav, setWeirdFav] = useState(null);
    // const COLS = 4;


    useEffect(() => {
        const getFavs = async () => {
            const jsondata = await fetch('/api/get-favs')
            const data = await jsondata.json();
            const favsReversed = await data.nodes?.reverse()
            setFavs(favsReversed);

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
                setFavvs(res)
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
        if (weirdFav) removeFav();
    }, [weirdFav])

    return (
        <div className={st.instagram}>
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
                            onClick={() => setWeirdFav({shortcode: node.shortcode})}
                        >
                            ✕
                        </button>
                    </div>


                ))}
            </div>
        </div>
    );
}

export default Favs;