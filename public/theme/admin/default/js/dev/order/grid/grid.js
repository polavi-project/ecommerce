import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import {PaymentStatus} from "../edit/payment-status.js";
import {ShipmentStatus} from "../edit/shipment-status.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";

function IdColumnHeader({areaProps, filters, updateFilter}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(filterTo.current.value == "" && filterFrom.current.value == "")
                removeFilter("id");
            else
                updateFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("order_id");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex((e)=> e.key === 'id') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex((e)=> e.key === 'id') === -1 ? "" : filterTo.current.value;
    });

    return <th className={"column"}>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"From"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => onKeyPress(e)}
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

function NumberColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("order_number");
            else
                updateFilter("order_number", "=", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        areaProps.addField('order_number');
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'order_number') === -1 ? "" : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header name-header">
            <div className={"title"}><span>Order number</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Order number"}
                    className="uk-input uk-form-small uk-form-width-medium"
                />
            </div>
        </div>
    </th>
}

function NumberColumnRow({row}) {
    return <td><span>#{_.get(row, 'order_number' , '')}</span></td>;
}

function TotalColumnHeader({areaProps, filters, updateFilter})
{
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(filterTo.current.value == "" && filterFrom.current.value == "")
                removeFilter("grand_total");
            else
                updateFilter("grand_total", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("grand_total");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex((e)=> e.key === 'grand_total') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex((e)=> e.key === 'grand_total') === -1 ? "" : filterTo.current.value;
    });

    return <th>
        <div className="header price-header">
            <div className={"title"}><span>Total</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"From"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"To"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
            </div>
        </div>
    </th>
}

function TotalColumnRow({row}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency'));
    const _grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(_.get(row, "grand_total"));
    return <td>
        <span>{_grandTotal}</span>
    </td>
}

function PaymentStatusColumnHeader({areaProps, filters, updateFilter})
{
    const filterInput = React.useRef(null);

    const onChange = (e) => {
        updateFilter("payment_status", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        areaProps.addField("payment_status");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'payment_status') === -1 ? null : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header payment-status-header">
            <div className={"title"}><span>Payment status</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="uk-select uk-form-small uk-form-width-small"
                >
                    <PaymentStatus noOuter={true}/>
                </select>
            </div>
        </div>
    </th>
}

function PaymentStatusColumnRow({row}) {
    return <td>
        <PaymentStatus status={_.get(row, "payment_status")}/>
    </td>
}

function ShipmentStatusColumnHeader({areaProps, filters, updateFilter})
{
    const filterInput = React.useRef(null);

    const onChange = (e) => {
        updateFilter("shipment_status", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        areaProps.addField("shipment_status");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'shipment_status') === -1 ? null : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header shipment-status-header">
            <div className={"title"}><span>Shipment status</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="uk-select uk-form-small uk-form-width-small"
                >
                    <ShipmentStatus noOuter={true}/>
                </select>
            </div>
        </div>
    </th>
}

function ShipmentStatusColumnRow({row}) {
    return <td>
        <ShipmentStatus status={_.get(row, "shipment_status")}/>
    </td>
}

function OrderDateColumnHeader({areaProps, filters, updateFilter})
{
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(filterTo.current.value == "" && filterFrom.current.value == "")
                removeFilter("created_at");
            else
                updateFilter("created_at", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("created_at");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex((e)=> e.key === 'created_at') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex((e)=> e.key === 'created_at') === -1 ? "" : filterTo.current.value;
    });

    return <th>
        <div className="header price-header">
            <div className={"title"}><span>Order date</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"From"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"To"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
            </div>
        </div>
    </th>
}

function OrderDateColumnRow({row}) {
    return <td>
        <span>{_.get(row, "created_at")}</span>
    </td>
}

function ActionColumnHeader({areaProps, filters, updateFilter}) {
    React.useEffect(() => {
        areaProps.addField('order_id');
        areaProps.addField('editUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return <th className={"column"}>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
            <a onClick={()=>onClick()}>Clean filter</a>
        </div>
    </th>
}

function ActionColumnRow({row}) {
    return <td><A url={_.get(row, 'editUrl' , '')} text={"Edit"}/></td>;
}

export default function OrderGrid({apiUrl, areaProps})
{
    const [orders, setOrders] = React.useState([]);
    const [fields, setFields] = React.useState([]);

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
                if(_.get(response, 'payload.data.orderCollection.orders')) {
                    setOrders(_.get(response, 'payload.data.orderCollection.orders'));
                }
            }
        );
    };

    const buildQuery = () => {
        let filterStr = "";
        areaProps.filters.forEach((f,i) => {
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
    }, [fields, areaProps.filters]);

    return <div className={"uk-overflow-auto"}>
        <table className="uk-table uk-table-small uk-table-divider">
            <thead>
                <tr>
                    <Area
                        className={""}
                        id={"order_grid_header"}
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
                                component: NumberColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 20,
                                id: "number"
                            },
                            {
                                component: TotalColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 30,
                                id: "grand_total"
                            },
                            {
                                component: PaymentStatusColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 40,
                                id: "payment_status"
                            },
                            {
                                component: ShipmentStatusColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 50,
                                id: "shipment_status"
                            },
                            {
                                component: OrderDateColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 60,
                                id: "order_date"
                            },
                            {
                                component: ActionColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 70,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            </thead>
            <tbody>
            {orders.map((o, i)=> {
                return <tr>
                    <Area
                        key={i}
                        className={""}
                        id={"order_grid_row"}
                        row={o}
                        noOuter={true}
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
                                component: OrderDateColumnRow,
                                props : {row: o},
                                sort_order: 60,
                                id: "order_date"
                            },
                            {
                                component: ActionColumnRow,
                                props : {row: o},
                                sort_order: 70,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            })}
            </tbody>
        </table>
        {orders.length === 0 &&
        <div>There is no order to display</div>
        }
    </div>
}