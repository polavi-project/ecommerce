import {Fetch} from "./fetch.js";

function LanguageSwitcher(props) {
    const [current, setCurrent] = React.useState(props.languages.find((e)=> { return parseInt(e.id) === parseInt(props.current)}));

    const onChange = (id) => {
        if (confirm('All data that hasn\'t been saved will be lost.Please confirm')) {
            const url = new URL(window.location.href);
            url.searchParams.set('language', id);
            setCurrent(props.languages.find((e)=> { return parseInt(e.id) === parseInt(id)}));
            Fetch(url);
        } else {
            return false;
        }
    };

    return <div>
        <button className="uk-button uk-button-default" type="button"><span className={"flag-icon flag-icon-" + current.code}>{current.name}</span></button>
        <div uk-dropdown="bottom-right">
            <ul className="uk-nav uk-dropdown-nav">
                {props.languages.map((l,i) => {
                    return <li key={i}><a href="javascript:void(0)" onClick={() => onChange(l.id)}><span className={"flag-icon flag-icon-" + l.code}>{l.name}</span></a></li>
                })}
            </ul>
        </div>
    </div>
}

export default LanguageSwitcher