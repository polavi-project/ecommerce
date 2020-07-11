import A from "../../../../../../js/production/a.js";

export default function Navigation(props) {
    return <nav className="uk-navbar-container uk-navbar-transparent" uk-navbar="mode: hover">
        <div className="uk-navbar-left">
            <ul className="uk-navbar-nav">
                {props.items.map((i, index)=>{
                    return <li key={index}>
                        <A url={i.url} text={i.name}/>
                    </li>
                })}
            </ul>
        </div>
    </nav>
}