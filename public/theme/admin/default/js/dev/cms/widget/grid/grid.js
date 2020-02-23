import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

function IdColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField("cms_widget_id");
    }, []);

    return <td>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
        </div>
    </td>
}

function IdColumnRow({row}) {
    return <td><span>{row.cms_widget_id}</span></td>;
}

function NameColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("name");
            else
                updateFilter("name", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("name");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'name') === -1 ? "" : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header coupon-header">
            <div className={"title"}><span>Name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Name"}
                    className="uk-input uk-form-small uk-form-width-small"
                />
            </div>
        </div>
    </th>
}

function NameColumnRow({row}) {
    return <td><span>{_.get(row, 'name' , '')}</span></td>;
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
        <div className="header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="uk-select uk-form-small uk-form-width-small"
                >
                    <option value={1}>Enabled</option>
                    <option value={0}>Disabled</option>
                </select>
            </div>
        </div>
    </th>
}

function StatusColumnRow({row}) {
    if(parseInt(_.get(row, "status")) === 1)
        return <td><span className="uk-label uk-label-success">Enable</span></td>;
    else
        return <td><span className="uk-label uk-label-danger">Disabled</span></td>;
}

function TypeColumnHeader({areaProps, filters, updateFilter})
{
    const filterInput = React.useRef(null);

    const onChange = (e) => {
        updateFilter("type", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        areaProps.addField("type");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'type') === -1 ? null : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header type-header">
            <div className={"title"}><span>Type</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="uk-select uk-form-small uk-form-width-small"
                >
                    <Area
                        id={"widget_types"}
                        noOuter={true}
                    />
                </select>
            </div>
        </div>
    </th>
}

function TypeColumnRow({row}) {
    return <Area
        id={"widget_types"}
        selectedType={_.get(row, "type")}
    />;
}

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('cms_widget_id');
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

export default function WidgetGrid({apiUrl, areaProps})
{
    const [widgets, setWidgets] = React.useState([]);
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
                if(_.get(response, 'payload.data.widgetCollection.widgets')) {
                    setWidgets(_.get(response, 'payload.data.widgetCollection.widgets'));
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

        return `{widgetCollection ${filterStr} {widgets {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return <div className={"uk-overflow-auto"}>
        <table className="uk-table uk-table-small">
            <thead>
                <tr>
                    <Area
                        className={""}
                        id={"widget_grid_header"}
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
                                component: TypeColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 20,
                                id: "type"
                            },
                            {
                                component: NameColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 30,
                                id: "name"
                            },
                            {
                                component: StatusColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 40,
                                id: "status"
                            },
                            {
                                component: ActionColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 50,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            </thead>
            <tbody>
            {widgets.map((w, i)=> {
                return <tr>
                    <Area
                        key={i}
                        className={""}
                        id={"widget_grid_row"}
                        row={w}
                        noOuter={true}
                        coreWidgets={[
                            {
                                component: IdColumnRow,
                                props : {row: w},
                                sort_order: 10,
                                id: "id"
                            },
                            {
                                component: TypeColumnRow,
                                props : {row: w},
                                sort_order: 20,
                                id: "type"
                            },
                            {
                                component: NameColumnRow,
                                props : {row: w},
                                sort_order: 30,
                                id: "name"
                            },
                            {
                                component: StatusColumnRow,
                                props : {row: w},
                                sort_order: 40,
                                id: "status"
                            },
                            {
                                component: ActionColumnRow,
                                props : {row: w},
                                sort_order: 50,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            })}
            </tbody>
        </table>
        {widgets.length === 0 &&
        <div>There is no widget to display</div>
        }
    </div>
}