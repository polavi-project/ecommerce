import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import {PaymentStatus} from "../edit/payment-status.js";
import {ShipmentStatus} from "../edit/shipment-status.js";

function IdColumnHeader({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("order_id");
    }, []);

    return <th>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                        placeholder={"From"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                        placeholder={"To"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
            </div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.order_id}</span></td>;
}

function NumberColumnHeader({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('order_number');
    }, []);

    return <th>
        <div className="header name-header">
            <div className={"title"}><span>Order number</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("order_number", "=", `${e.target.value}`);}}
                    placeholder={"Order number"}
                    className="uk-input uk-form-small uk-form-width-small"
                />
            </div>
        </div>
    </th>
}

function NumberColumnRow({row}) {
    return <td><span>#{_.get(row, 'order_number' , '')}</span></td>;
}

function TotalColumnHeader({areaProps})
{
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("grand_total");
    }, []);

    return <th>
        <div className="header id-header">
            <div className={"title"}><span>Total</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("grand_total", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                        placeholder={"From"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("grand_total", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                        placeholder={"To"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
            </div>
        </div>
    </th>
}

function TotalColumnRow({row}) {
    return <td>
        <span>{_.get(row, "grand_total")}</span>
    </td>
}

function PaymentStatusColumnHeader({areaProps})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("payment_status");
    }, []);

    const onChange = (e)=> {
        areaProps.addFilter("payment_status", "=", e.target.value);
    };

    return <th>
        <div className="header status-header">
            <div className={"title"}><span>Payment status</span></div>
            <div className={"filter"}>
                <PaymentStatus
                    isDropdown={true}
                    wrapperProps={{
                        className: "uk-select uk-form-small uk-form-width-small",
                        ref: filterInput,
                        onChange: (e) => onChange(e)
                    }}
                />
            </div>
        </div>
    </th>
}

function PaymentStatusColumnRow({row}) {
    return <td>
        <PaymentStatus status={_.get(row, "payment_status")}/>
    </td>
}

function ShipmentStatusColumnHeader({areaProps})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("shipment_status");
    }, []);

    const onChange = (e)=> {
        areaProps.addFilter("shipment_status", "=", e.target.value);
    };

    return <th>
        <div className="header status-header">
            <div className={"title"}><span>Shipment status</span></div>
            <div className={"filter"}>
                <ShipmentStatus
                    isDropdown={true}
                    wrapperProps={{
                        className: "uk-select uk-form-small uk-form-width-small",
                        ref: filterInput,
                        onChange: (e) => onChange(e)
                    }}
                />
            </div>
        </div>
    </th>
}

function ShipmentStatusColumnRow({row}) {
    return <td>
        <ShipmentStatus status={_.get(row, "shipment_status")}/>
    </td>
}

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
    }, []);

    return <th>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
        </div>
    </th>
}

function ActionColumnRow({row}) {
    return <td><A url={_.get(row, 'editUrl' , '')} text={"Edit"}/></td>;
}

export default function OrderGrid({apiUrl})
{
    const [orders, setOrders] = React.useState([]);
    const [filters, setFilters] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addFilter = (key, operator, value) => {
        let flag = 0;
        filters.forEach((f, i) => {
            if(f.key === key && !value)
                flag = 1; // Remove
            if(f.key === key && value)
                flag = 2; // Update
        });
        if(flag === 0)
            setFilters(prevFilters => prevFilters.concat({key: key, operator: operator, value: value}));
        else if(flag === 1) {
            const setFilters = prevFilters.filter((f, index) => f.key !== key);
            setFilters(newFilters);
        } else
            setFilters(prevFilters => prevFilters.map((f, i) => {
                if(f.key === key) {
                    f.operator = operator;
                    f.value = value;
                }
                return f;
            }));
    };

    const cleanFilter = () => {
        setFilters([]);
    };
    const addField = (field) => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());
        axios({
            method: 'post',
            url: apiUrl,
            headers: { 'content-type': 'multipart/form-data' },
            data: formData
        }).then(function (response) {
            if(response.headers['content-type'] !== "application/json")
                throw new Error('Something wrong, please try again');
            if(_.get(response, 'data.payload.data.orderCollection.orders')) {
                setOrders(_.get(response, 'data.payload.data.orderCollection.orders'));
            }
        }).catch(function (error) {
        }).finally(function() {
            // e.target.value = null;
            // setUploading(false);
        });
    };

    const buildQuery = () => {
        let filterStr = "";
        filters.forEach((f,i) => {
            filterStr +=`${f.key} : {operator : "${f.operator}" value: "${f.value}"} `;
        });
        filterStr = filterStr.trim();
        if(filterStr)
            filterStr = `(filter : {${filterStr}})`;

        let fieldStr = "";
        fields.forEach((f,i) => {
            fieldStr +=`${f} `;
        });

        return `{orderCollection ${filterStr} {orders {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, filters]);

    return <div className={"uk-overflow-auto"}>
        <table className="uk-table uk-table-small uk-table-divider">
            <thead>
            <Area
                className={""}
                id={"order_grid_header"}
                addFilter={addFilter}
                cleanFilter={cleanFilter}
                addField={addField}
                applyFilter={applyFilter}
                reactcomponent={"tr"}
                coreWidgets={[
                    {
                        component: IdColumnHeader,
                        props : {addFilter, cleanFilter, addField, applyFilter},
                        sort_order: 10,
                        id: "id"
                    },
                    {
                        component: NumberColumnHeader,
                        props : {},
                        sort_order: 20,
                        id: "number"
                    },
                    {
                        component: TotalColumnHeader,
                        props : {},
                        sort_order: 30,
                        id: "grand_total"
                    },
                    {
                        component: PaymentStatusColumnHeader,
                        props : {},
                        sort_order: 40,
                        id: "payment_status"
                    },
                    {
                        component: ShipmentStatusColumnHeader,
                        props : {},
                        sort_order: 50,
                        id: "shipment_status"
                    },
                    {
                        component: ActionColumnHeader,
                        props : {},
                        sort_order: 60,
                        id: "action"
                    }
                ]}
            />
            </thead>
            <tbody>
            {orders.map((o, i)=> {
                return <Area
                    key={i}
                    className={""}
                    id={"order_grid_row"}
                    row={o}
                    reactcomponent={"tr"}
                    coreWidgets={[
                        {
                            component: IdColumnRow,
                            props : {row: o},
                            sort_order: 10,
                            id: "id"
                        },
                        {
                            component: NumberColumnRow,
                            props : {row: o},
                            sort_order: 20,
                            id: "number"
                        },
                        {
                            component: TotalColumnRow,
                            props : {row: o},
                            sort_order: 30,
                            id: "grand_total"
                        },
                        {
                            component: PaymentStatusColumnRow,
                            props : {row: o},
                            sort_order: 40,
                            id: "payment_status"
                        },
                        {
                            component: ShipmentStatusColumnRow,
                            props : {row: o},
                            sort_order: 50,
                            id: "shipment_status"
                        },
                        {
                            component: ActionColumnRow,
                            props : {row: o},
                            sort_order: 60,
                            id: "action"
                        }
                    ]}
                />
            })}
            </tbody>
        </table>
        {orders.length === 0 &&
        <div>There is no order to display</div>
        }
    </div>
}