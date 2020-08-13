import A from "../../../../../../../js/production/a.js";

export default function BreadcrumbsWidget({id, items}) {
    items.sort((a, b) => parseInt(a.sort_order) - parseInt(b.sort_order));
    return <div className="breadcrumbs container">
        <ul>
            {items.map((i, k) => {
                return <li key={k}>
                    {i.link !== null ? (<A url={i.link} text={i.title}/>) : (<span>{i.title}</span>)}
                </li>
            })}
        </ul>
    </div>
}