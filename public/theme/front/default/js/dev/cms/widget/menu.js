import A from "../../../../../../../js/production/a.js";

export default function Menu({items = []}) {
    return <div className="main-menu">
        <nav className="uk-navbar-container uk-navbar-transparent uk-navbar">
            <div className="uk-navbar-left">
                <ul className="uk-navbar-nav">
                    {items.map((i, k)=> {
                        return <li key={k}><A url={i.url} text={i.label}/></li>
                    })}
                </ul>
            </div>
        </nav>
    </div>
}