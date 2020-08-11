import A from "../../../../../../../js/production/a.js";

export default function Menu({items = []}) {
    return <div className="main-menu">
        <ul  className="nav justify-content-center">
            {items.map((i, k)=> {
                return <li key={k} className="nav-item"><A className="nav-link" url={i.url} text={i.label}/></li>
            })}
        </ul>
    </div>
}