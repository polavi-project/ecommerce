import {Fetch} from "./fetch.js"

export default function A({id, pushState, classes, url, text, children}) {
    const onClick = (e) => {
        e.preventDefault();
        if(!url)
            return false;
        if(pushState === undefined)
            pushState = true;
        Fetch(url, pushState);
    };

    return <a key={id} className={classes} href={url} onClick={(e)=>onClick(e)}>
        {text}
        {children}
    </a>;
}