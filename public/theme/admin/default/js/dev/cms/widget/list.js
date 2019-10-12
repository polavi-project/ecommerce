import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import {REQUEST_END} from "../../../../../../../js/production/event-types.js";

function IdColumn({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("cms_widget_id");
    }, []);

    return <div className={"column"}>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterFrom}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                    placeholder={"From"}
                />
                <input
                    type={"text"}
                    ref={filterTo}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                    placeholder={"To"}
                />
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{r.widget_id}</span></div>;
        })}
    </div>
}

function NameColumn({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    return <div className={"column"}>
        <div className="header name-header">
            <div className={"title"}><span>Widget name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("name", "LIKE", `%${e.target.value}%`);}}
                    placeholder={"Widget name"}
                />
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{_.get(r, 'name' , '')}</span></div>;
        })}
    </div>
}

function GeneralColumn({index, title, areaProps}) {
    React.useEffect(() => {
        areaProps.addField(index);
    }, []);
    return <div className={"column"}>
        <div className="header">
            <div className={"title"}><span>{title}</span></div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{_.get(r, index , '')}</span></div>;
        })}
    </div>
}
function ActionColumn({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
    }, []);
    return <div className={"column"}>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><A url={_.get(r, 'editUrl' , '')} text={"Edit"}/></div>;
        })}
    </div>
}

function StatusColumn({areaProps})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    return <div className={"column"}>
        <div className="header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <input type={"text"} ref={filterInput} onKeyPress={(e) => {
                    if(e.key === 'Enter') areaProps.addFilter("status", "Equal", e.target.value);
                }
                }/>
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            if(parseInt(_.get(r, "status")) === 1)
                return <div key={i} className={"row"}><span className="uk-label uk-label-success">Enable</span></div>;
            else
                return <div key={i} className={"row"}><span className="uk-label uk-label-danger">Disabled</span></div>;
        })}
    </div>
}

function WidgetGrid({apiUrl, defaultFilter})
{
    // React.useEffect(() => {
    //     let token = PubSub.subscribe(REQUEST_END, function(message, data) {
    //         if(_.get(data, 'payload.data.createWidget.status') === true)
    //             applyFilter();
    //     });
    //
    //     return function cleanup() {
    //         PubSub.unsubscribe(token);
    //     };
    // }, []);

    const [widgets, setWidgets] = React.useState([]);
    const [filters, setFilters] = React.useState(() => {
        if(defaultFilter !== undefined)
            return defaultFilter;
        else
            return [];
    });
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
            if(_.get(response, 'data.payload.data.widgetCollection.widgets')) {
                setWidgets(_.get(response, 'data.payload.data.widgetCollection.widgets'));
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

        return `{widgetCollection ${filterStr} {widgets {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, filters]);

    return <div className={"grid widget-grid"}>
        <Area
            className={"uk-grid uk-grid-small"}
            id={"widget-grid"}
            rows={widgets}
            addFilter={addFilter}
            cleanFilter={cleanFilter}
            addField={addField}
            coreWidgets={[
                {
                    component: IdColumn,
                    props : {
                    },
                    sort_order: 10,
                    id: "id"
                },
                {
                    component: NameColumn,
                    props : {
                    },
                    sort_order: 30,
                    id: "name"
                },
                {
                    component: StatusColumn,
                    props : {
                    },
                    sort_order: 40,
                    id: "status"
                },
                {
                    component: ActionColumn,
                    props : {
                    },
                    sort_order: 50,
                    id: "editColumn"
                }
            ]}
        />
    </div>
}

export {WidgetGrid}