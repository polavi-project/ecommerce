import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import {PaymentStatus} from "../edit/payment-status.js";
import {ShipmentStatus} from "../edit/shipment-status.js";

function IdColumn({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("order_id");
    }, []);

    return <td className={"column"}>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                        placeholder={"From"}
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                        placeholder={"To"}
                    />
                </div>
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{r.order_id}</span></div>;
        })}
    </td>
}

function NumberColumn({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('order_number');
    }, []);

    return <td className={"column"}>
        <div className="header name-header">
            <div className={"title"}><span>Order number</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("orderNumber", "Equal", `%${e.target.value}%`);}}
                    placeholder={"Order number"}
                />
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{_.get(r, 'order_number' , '')}</span></div>;
        })}
    </td>
}

function GeneralColumn({index, title, areaProps}) {
    React.useEffect(() => {
        areaProps.addField(index);
    }, []);
    return <td className={"column"}>
        <div className="header">
            <div className={"title"}><span>{title}</span></div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{_.get(r, index , '')}</span></div>;
        })}
    </td>
}

function ActionColumn({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
    }, []);
    return <td className={"column"}>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><A url={_.get(r, 'editUrl' , '')} text={"Edit"}/></div>;
        })}
    </td>
}

function PaymentStatusColumn({areaProps})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("payment_status");
    }, []);

    return <td className={"column"}>
        <div className="header status-header">
            <div className={"title"}><span>Payment status</span></div>
            <div className={"filter"}>
                <input type={"text"} ref={filterInput} onKeyPress={(e) => {
                    if(e.key === 'Enter') areaProps.addFilter("payment_status", "Equal", e.target.value);
                }
                }/>
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div key={i} className={"row"}>
                <PaymentStatus status={_.get(r, "payment_status")}/>
            </div>
        })}
    </td>
}
function ShipmentStatusColumn({areaProps})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("shipment_status");
    }, []);

    return <td className={"column"}>
        <div className="header status-header">
            <div className={"title"}><span>Shipment status</span></div>
            <div className={"filter"}>
                <input type={"text"} ref={filterInput} onKeyPress={(e) => {
                    if(e.key === 'Enter') areaProps.addFilter("shipment_status", "Equal", e.target.value);
                }
                }/>
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div key={i} className={"row"}>
                <ShipmentStatus status={_.get(r, "shipment_status")}/>
            </div>
        })}
    </td>
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
            filterStr +=`${f.key} : {operator : ${f.operator} value: "${f.value}"} `;
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

    React.useLayoutEffect(() => {
        // Fix height of row
        let maxHeightHeader = -1;
        jQuery('.column .header').each(function(e) {
            maxHeightHeader = maxHeightHeader > jQuery(this).height() ? maxHeightHeader : jQuery(this).height();
        });

        jQuery('.column .header').each(function() {
            jQuery(this).height(maxHeightHeader);
        });

        let maxHeightRow = -1;
        jQuery('.column .row').each(function(e) {
            maxHeightRow = maxHeightRow > jQuery(this).height() ? maxHeightRow : jQuery(this).height();
        });

        jQuery('.column .row').each(function() {
            jQuery(this).height(maxHeightRow);
        });
    });

    return <div className={""}>
            <table className="uk-table uk-table-small">
                <tbody>
                <Area
                    className={""}
                    id={"order-grid"}
                    rows={orders}
                    addFilter={addFilter}
                    cleanFilter={cleanFilter}
                    addField={addField}
                    reactcomponent={"tr"}
                    coreWidgets={[
                        {
                            component: IdColumn,
                            props : {
                            },
                            sort_order: 10,
                            id: "id"
                        },
                        {
                            component: NumberColumn,
                            props : {
                            },
                            sort_order: 20,
                            id: "number"
                        },
                        {
                            component: PaymentStatusColumn,
                            props : {
                            },
                            sort_order: 30,
                            id: "payment_status"
                        },
                        {
                            component: ShipmentStatusColumn,
                            props : {
                            },
                            sort_order: 40,
                            id: "shipment_status"
                        },
                        {
                            component: ActionColumn,
                            props : {
                            },
                            sort_order: 50,
                            id: "actionColumn"
                        }
                    ]}
                />
                </tbody>
            </table>
    </div>
}