import { Fetch } from "./fetch.js";

export default function A({ id, pushState, className, url, text, children }) {
    const onClick = e => {
        e.preventDefault();
        if (!url) return false;
        if (pushState === undefined) pushState = true;
        Fetch(url, pushState);
    };

    return React.createElement(
        "a",
        { key: id, className: className, href: url, onClick: e => onClick(e) },
        text,
        children
    );
}