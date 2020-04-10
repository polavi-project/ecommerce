import A from "./a.js";



export default function Navigation(props) {
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
        if(items.length == 0)
            return null;
        return <ul className="list-unstyled">
            {
                items.map((r,i) => {
                    return <li key={i} className="nav-item">
                        <A url={r.url}>
                            {
                                r.icon && <i className={"fas fa-"+ r.icon}></i>
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
    return <ul className={"list-unstyled"}>
        {
            rootItems.map((r,i) => {
                return <li key={i} className="nav-item">
                    {   r.url &&
                    <A url={r.url} className={"root-label"}>
                        {
                            r.icon && <i className={"fas fa-"+ r.icon}></i>
                        }
                        {r.title}
                    </A>
                    }
                    {   !r.url &&
                    <span className={"root-label"}>
                            {
                                r.icon && <i className={"fas fa-"+ r.icon}></i>
                            }
                        {r.title}
                        </span>
                    }
                    {
                        renderChildren(r.id)
                    }
                </li>
            })
        }
    </ul>
}