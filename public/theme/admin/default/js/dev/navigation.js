import A from "../../../../../js/production/a.js";

export default function AdminMenu(props) {
    const getRootItems = () => {
        let result = props.items.filter(item => item.parent_id === null);
        result.sort((a, b) => {
            return a.sort_order - b.sort_order;
        });

        return result;
    };

    const getChildrenItems = (id) => {
        let result = props.items.filter(item => item.parent_id === id);
        result.sort((a, b) => {
            return a.sort_order - b.sort_order;
        });
        return result;
    };

    const renderChildren = (id) => {
        let items = getChildrenItems(id);
        return <ul className="uk-nav-sub">
            {
                items.map((r,i) => {
                    return <li key={i} className="uk-parent">
                        <A url={r.url}>
                            {
                                r.icon && <span className="uk-margin-small-right" uk-icon={"icon: " + r.icon + "; ratio: 0.8"}></span>
                            }
                            {r.title}
                        </A>
                        {
                            renderChildren(r.id)
                        }
                    </li>
                })
            }
        </ul>

    };
    let rootItems = getRootItems();
    return <div id="menu">
        <ul className="uk-nav-default uk-nav-parent-icon" uk-nav="multiple: true">
            {
                rootItems.map((r,i) => {
                    return <li key={i} className="uk-parent">
                        {
                            <A url={r.url}>
                                {
                                    r.icon && <span className="uk-margin-small-right" uk-icon={"icon: " + r.icon + "; ratio: 0.8"}></span>
                                }
                                {r.title}
                            </A>
                        }
                        {
                            renderChildren(r.id)
                        }
                    </li>
                })
            }
        </ul>
    </div>
}