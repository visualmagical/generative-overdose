import React, { useEffect, useState } from 'react';
import st from "./styles.module.css";



const Favs = () => {
    const [favs, setFavs] = useState([]);
    const [weirdFav, setWeirdFav] = useState(null);
    // const COLS = 4;


    useEffect(() => {
        const getFavs = async () => {
            const response = await fetch('/api/get-favs')
            const data = await response.json();
            setFavs(data.nodes?.reverse());
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
                body: JSON.stringify({ fav: weirdFav }),
            });
            const data = await response.json();
            setFavs(data.nodes?.reverse());
        }
        if (weirdFav) removeFav();
    }, [weirdFav])


    return (
        <div className={st.instagram}>
            <div
                className={st.feed}
            >
                {favs?.length > 0 && favs.map(node => (
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
                                src={node.display_url}
                                alt={node.shortcode}
                            />

                        </a>
                        <button
                            className={st.add}
                            onClick={() => setWeirdFav({ display_url: node.display_url, shortcode: node.shortcode })}
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