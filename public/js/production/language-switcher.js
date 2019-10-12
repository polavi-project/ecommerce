import { Fetch } from "./fetch.js";

function LanguageSwitcher(props) {
    const [current, setCurrent] = React.useState(props.languages.find(e => {
        return parseInt(e.id) === parseInt(props.current);
    }));

    const onChange = id => {
        if (confirm('All data that hasn\'t been saved will be lost.Please confirm')) {
            const url = new URL(window.location.href);
            url.searchParams.set('language', id);
            setCurrent(props.languages.find(e => {
                return parseInt(e.id) === parseInt(id);
            }));
            Fetch(url);
        } else {
            return false;
        }
    };

    return React.createElement(
        'div',
        null,
        React.createElement(
            'button',
            { className: 'uk-button uk-button-default', type: 'button' },
            React.createElement(
                'span',
                { className: "flag-icon flag-icon-" + current.code },
                current.name
            )
        ),
        React.createElement(
            'div',
            { 'uk-dropdown': 'bottom-right' },
            React.createElement(
                'ul',
                { className: 'uk-nav uk-dropdown-nav' },
                props.languages.map((l, i) => {
                    return React.createElement(
                        'li',
                        { key: i },
                        React.createElement(
                            'a',
                            { href: 'javascript:void(0)', onClick: () => onChange(l.id) },
                            React.createElement(
                                'span',
                                { className: "flag-icon flag-icon-" + l.code },
                                l.name
                            )
                        )
                    );
                })
            )
        )
    );
}

export default LanguageSwitcher;