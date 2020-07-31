import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import Pagination from "../../../../../../../js/production/grid/pagination.js";

function IdColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField("newsletter_subscriber_id");
    }, []);

    return <th>
        <div className="table-header id-header">
            <div className={"title"}><span>ID</span></div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.newsletter_subscriber_id}</span></td>;
}

function EmailColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('email');
    }, []);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("email");
            else
                updateFilter("email", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'email') === -1 ? "" : filterInput.current.value;
    });

    return <th>
        <div className="table-header name-header">
            <div className={"title"}><span>Email</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Email"}
                    className="form-control"
                />
            </div>
        </div>
    </th>
}

function EmailColumnRow({row}) {
    return <td><span>{_.get(row, 'email' , '')}</span></td>;
}

function NameColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('full_name');
    }, []);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("full_name");
            else
                updateFilter("full_name", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'full_name') === -1 ? "" : filterInput.current.value;
    });

    return <th>
        <div className="table-header name-header">
            <div className={"title"}><span>Full name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Full name"}
                    className="form-control"
                />
            </div>
        </div>
    </th>
}

function NameColumnRow({row}) {
    return <td><span>{_.get(row, 'full_name' , '')}</span></td>;
}

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('customer_id');
        areaProps.addField('customerEditUrl');
        areaProps.addField('subscribeUrl');
        areaProps.addField('unsubscribeUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return <th className="column action-column">
        <div className="table-header">
            <div className={"title"}><span></span></div>
            <div className="filter">
                <a onClick={()=>onClick()} className="text-danger" title="Clear filter" href="javascript:void(0)">
                    <i className="fa fa-filter"></i>
                    <i className="fa fa-slash" style={{marginLeft: "-13px"}}></i>
                </a>
            </div>
        </div>
    </th>
}

function ActionColumnRow({row}) {
    const currentUrl = ReactRedux.useSelector(state => {return _.get(state, 'appState.currentUrl')});

    const unsubscribe = (e, email, customerId) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', email);
        formData.append('customer_id', customerId);
        Fetch(row.unsubscribeUrl, false, "POST", formData, null, (response)=> {
            if(parseInt(response.success) === 1)
                return Fetch(currentUrl);
        });
    };

    const subscribe = (e, email) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', email);
        Fetch(row.subscribeUrl, false, "POST", formData, null, (response)=> {
            if(parseInt(response.success) === 1)
                return Fetch(currentUrl);
        });
    };

    return <td>
        {row.customerEditUrl && <div><A url={row.customerEditUrl}>Visit customer</A></div>}
        {row.status == "subscribed" && <div><a className="text-danger" href={"#"} onClick={(e) => unsubscribe(e, row.email, row.customer_id)}>Unsubscribe</a></div>}
        {row.status == "unsubscribed" && <div><a className="text-primary" href={"#"} onClick={(e) => subscribe(e, row.email)}>Subscribe</a></div>}
    </td>;
}

function StatusColumnHeader({areaProps, filters, updateFilter})
{
    const filterInput = React.useRef(null);

    const onChange = (e) => {
        updateFilter("status", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'status') === -1 ? null : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="table-header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="form-control"
                >
                    <option value={"subscribed"}>Subscribed</option>
                    <option value={"unsubscribed"}>Unsubscribed</option>
                </select>
            </div>
        </div>
    </th>
}

function StatusColumnRow({row}) {
    if(_.get(row, "status") === "subscribed")
        return <td><span className="badge badge-success">Subscribed</span></td>;
    else
        return <td><span className="badge badge-secondary">Unsubscribed</span></td>;
}

export default function SubscriberGrid({apiUrl, areaProps})
{
    const [subscribers, setSubscribers] = React.useState([]);
    const [fields, setFields] = React.useState([]);
    const [total, setTotal] = React.useState(0);

    const addField = (field) => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(
            apiUrl,
            false,
            'POST',
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.subscriberCollection.subscribers')) {
                    setSubscribers(_.get(response, 'payload.data.subscriberCollection.subscribers'));
                    setTotal(_.get(response, 'payload.data.subscriberCollection.total'));
                }
            }
        );
    };

    const buildQuery = () => {
        let filters = [];
        areaProps.filters.forEach((f,i) => {
            filters.push(`{key: "${f.key}" operator: "${f.operator}" value: "${f.value}"}`);
        });
        let filterStr = filters.length > 0 ? `[${filters.join(",")}]` : "[]";

        let fieldStr = "";
        fields.forEach((f,i) => {
            fieldStr +=`${f} `;
        });

        return `{subscriberCollection (filters : ${filterStr}) {subscribers {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return <div className={"subscriber-grid mt-4"}>
        <table className="table table-bordered sticky">
            <thead>
                <tr>
                    <Area
                        className={""}
                        id={"subscriber_grid_header"}
                        filters={areaProps.filters}
                        addFilter={areaProps.addFilter}
                        updateFilter={areaProps.updateFilter}
                        removeFilter={areaProps.removeFilter}
                        cleanFilter={areaProps.cleanFilter}
                        addField={addField}
                        applyFilter={applyFilter}
                        noOuter={true}
                        coreWidgets={[
                            {
                                component: IdColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 10,
                                id: "id"
                            },
                            {
                                component: EmailColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 15,
                                id: "email"
                            },
                            {
                                component: NameColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: StatusColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 30,
                                id: "status"
                            },
                            {
                                component: ActionColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 35,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            </thead>
            <tbody>
            {subscribers.map((c, i)=> {
                return <tr>
                    <Area
                        key={i}
                        className={""}
                        id={"subscriber_grid_row"}
                        row={c}
                        noOuter={true}
                        coreWidgets={[
                            {
                                component: IdColumnRow,
                                props : {row: c},
                                sort_order: 10,
                                id: "id"
                            },
                            {
                                component: EmailColumnRow,
                                props : {row: c},
                                sort_order: 15,
                                id: "email"
                            },
                            {
                                component: NameColumnRow,
                                props : {row: c},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: StatusColumnRow,
                                props : {row: c},
                                sort_order: 30,
                                id: "status"
                            },
                            {
                                component: ActionColumnRow,
                                props : {row: c},
                                sort_order: 35,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            })}
            </tbody>
        </table>
        {subscribers.length === 0 &&
        <div>There is no subscriber to display</div>
        }
        <Pagination total={total} page={_.get(areaProps.filters.find((e)=> e.key === 'page'), 'value', 1)} limit={_.get(areaProps.filters.find((e)=> e.key === 'limit'), 'value', 20)} setFilter={areaProps.updateFilter}/>
    </div>
}