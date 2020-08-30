import React, { useEffect, useState } from 'react';
import Article from '../Article';
import st from "./styles.module.css";

import Parser from 'rss-parser';
let parser = new Parser();

const urlList = {
    colossal: 'https://www.thisiscolossal.com/feed/',
    artnome: 'http://feeds.feedburner.com/Blog-Artnome/',
    rizhome: 'http://feeds.feedburner.com/TheRhizomeBlogRss',
    increment: 'https://increment.com/feed.xml',
    clot: 'https://www.clotmag.com/feed',
    dan: 'https://www.seekingoutside.com/feed/',
    nervous: 'http://feeds.feedburner.com/NervousSystem',
}
const News = ({ baseHue }) => {
    const [feed, setFeed] = useState('');
    const SNIPPET_LENGTH = 3000;

    useEffect(() => {
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
        let cached = [];
        let fresh = [];

        const getCashedFeed =  async () => {
            const rawdata = await fetch('api/get-news')
            cached = await rawdata.json();
            console.log('preloaded', cached)
            setFeed(cached);
        }

        const getFeed = async () => {
            await parser.parseURL(CORS_PROXY + urlList.colossal, function(err, feed) {
                if (err) throw err;
                const colossalFeed = feed.items.map( (item, i) => {
                    const newItem = Object.assign(item, {
                        contentSnippet: item["content:encodedSnippet"],
                        source: 'Colossal',
                    });
                    return newItem;
                })
                console.log(colossalFeed[0].source)
                fresh.push(colossalFeed);
            })

            await parser.parseURL(CORS_PROXY + urlList.artnome, function(err, feed) {
                if (err) throw err;
                const labeled = feed.items.map(item => (Object.assign(item, { source: 'Artnome' })))
                console.log(labeled[0].source)
                fresh.push(labeled);
            })

            await parser.parseURL(CORS_PROXY + urlList.clot, function(err, feed) {
                if (err) throw err;
                const labeled = feed.items.map(item => ( Object.assign(item, { source: 'Clot' })))
                console.log(labeled[0].source)
                fresh.push(labeled);
            })

            await parser.parseURL(CORS_PROXY + urlList.increment, function(err, feed) {
                if (err) throw err;
                const labeled = feed.items.map(item => ( Object.assign(item, { source: 'Increment' })))
                console.log(labeled[0].source)
                fresh.push(labeled);
            })

            await parser.parseURL(CORS_PROXY + urlList.dan, function(err, feed) {
                if (err) throw err;
                const labeled = feed.items.map(item => ( Object.assign(item, { source: 'Seeking Outside' })))
                console.log(labeled[0].source)
                fresh.push(labeled);
            })

            // for (let i = 1; i < Object.values(urlList).length; i++) {
            //     await parser.parseURL(CORS_PROXY + Object.values(urlList)[i], function(err, feed) {
            //         if (err) throw err;
            //         fresh.push(feed.items)
            //     })
            // }

            // await parser.parseURL(CORS_PROXY + urlList.nervous, function(err, feed) {
            //     if (err) throw err;
            //     const labeled = feed.items.map(item => ( Object.assign(item, { source: 'Nervous' })))
            //     console.log(labeled)
            //     fresh.push(labeled);
            // })


            const ff = fresh
                .flat(1)
                .map(item => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString( item['content:encoded'], "text/html");
                    const preview = doc.querySelector('img');
                    const src = preview?.getAttribute('src');
                    const  image = src || '';
                    const snip = item.contentSnippet;
                    const date = new Date(item.pubDate);
                    const newItem = Object.assign(
                        item,
                        { contentSnippet: snip.length > SNIPPET_LENGTH ? `${snip.slice(0, SNIPPET_LENGTH)}...` : snip },
                        { formattedDate: date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })},
                        { image },
                    )
                    return newItem;
                } )
                .sort((a, b) => {
                    const dateA = new Date(a.pubDate);
                    const dateB = new Date(b.pubDate);
                    return dateB - dateA;
                })
                // .slice(0,20);

            fetch('/api/save-news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ news: ff }),
            })
            console.log('titles ',ff[0].title, cached[0].title, ff[0].title === cached[0].title)

            if (ff[0].title !== cached[0].title) {
                const loadNews = window.confirm(
                    "fresh news arrived. load them?"
                );
                if (loadNews) setFeed(ff);
            }
            // if (loadNews) setFeed(ff);
        }
        getCashedFeed();
        getFeed()


        // parser.parseURL(CORS_PROXY + urlList.rizhome, function(err, feed) {
        //     if (err) throw err;
        //     console.log(feed.items)
        //     // setIncrement(feed.items);
        // })

        // fetch(
        //     CORS_PROXY + 'http://feeds.feedburner.com/TheRhizomeBlogRss',
        //     {
        //         headers: {
        //             'Set-Cookie': 'SameSite=Strict'
        //         }
        //     })
        //         .then(response => response.text())
        //         .then(str => new window.DOMParser().parseFromString(str, "text/html"))
        //         .then(data => Array.from(data.querySelectorAll('.regularitem')))
        //         .then(data => data.map(item => ({
        //             title: item.querySelector('.itemtitle').innerHTML,
        //             url: item.querySelector('.itemtitle').href,
        //             content: item.querySelector('.itemcontent').innerHTML,
        //             pubDate: item.querySelector('.itemposttime').innerHTML,
        //         })))
        //         // .then(data => setColossal(data))


    }, []);

    return (
        <main className={st.main}>
            <ul>
                {feed && feed.map(c => (
                    <Article
                        key={c.title}
                        title={c.title}
                        link={c.link}
                        date={c.formattedDate}
                        hue={baseHue}
                        keywords={c.categories}
                        source={c.source}
                        // image={c.image}
                    />
                ))}
            </ul>


        </main>
    );
}

export default News;
