import React, { useEffect, useState } from 'react';
import st from "./styles.module.css";



const Instagram = () => {
    const [favs, setFavs] = useState([]);
    // const COLS = 4;


    useEffect(() => {
        const getFav = async () => {
            const response = await fetch('/api/get-favs')
            const data = await response.json();
            setFavs(data.nodes.reverse())
        }
        getFav();
    }, [])


    return (
        <div className={st.instagram}>
            <div
                className={st.feed}
            >
                {favs.length > 0 && favs.map(node => (
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
                    </div>

                ))}
            </div>
        </div>
    );
}

export default Instagram;