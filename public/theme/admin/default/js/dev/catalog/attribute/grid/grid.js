import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";
import Pagination from "../../../../../../../../js/production/grid/pagination.js";

function IdColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField("attribute_id");
    }, []);

    return <th>
        <div className="table-header id-header">
            <div className={"title"}><span>ID</span></div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.attribute_id}</span></td>
}

function TypeColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("type");
    }, []);

    const onChange = (e) => {
        updateFilter("type", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'type') === -1 ? null : filterInput.current.value;
    });

    return <th>
        <div className="table-header status-header">
            <div className={"title"}><span>Type</span></div>
            <div className={"filter"}>
                <select
                    className="form-control"
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                >
                    <option value={"select"}>Select</option>
                    <option value={"multiselect"}>Multi Select</option>
                    <option value={"text"}>Text</option>
                    <option value={"textarea"}>Textarea</option>
                    <option value={"date"}>Date</option>
                </select>
            </div>
        </div>
    </th>
}

function TypeColumnRow({row}) {
    return <td>
        {row.type == 'text' && <span>Text</span>}
        {row.type == 'select' && <span>Select</span>}
        {row.type == 'multiselect' && <span>Multi select</span>}
        {row.type == 'textarea' && <span>Textarea</span>}
        {row.type == 'date' && <span>Date</span>}
    </td>
}

function IsRequiredColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("is_required");
    }, []);

    const onChange = (e) => {
        updateFilter("is_required", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'is_required') === -1 ? null : filterInput.current.value;
    });

    return <th>
        <div className="table-header status-header">
            <div className={"title"}><span>Is required?</span></div>
            <div className={"filter"}>
                <select
                    className="form-control"
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
        </div>
    </th>
}

function IsRequiredColumnRow({row}) {
    if(row.is_required == 1) {
        return <td><span>Yes</span></td>
    } else {
        return <td><span>No</span></td>
    }
}

function IsFilterableColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("is_filterable");
    }, []);

    const onChange = (e) => {
        updateFilter("is_filterable", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'is_filterable') === -1 ? null : filterInput.current.value;
    });

    return <th>
        <div className="table-header status-header">
            <div className={"title"}><span>Is filterable?</span></div>
            <div className={"filter"}>
                <select
                    className="form-control"
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
        </div>
    </th>
}

function IsFilterableColumnRow({row}) {
    if(row.is_filterable == 1) {
        return <td><span>Yes</span></td>
    } else {
        return <td><span>No</span></td>
    }
}

function DisplayOnFrontendColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("display_on_frontend");
    }, []);

    const onChange = (e) => {
        updateFilter("display_on_frontend", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'display_on_frontend') === -1 ? null : filterInput.current.value;
    });

    return <th>
        <div className="table-header status-header">
            <div className={"title"}><span>Display on frontend?</span></div>
            <div className={"filter"}>
                <select
                    className="form-control"
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
        </div>
    </th>
}

function DisplayOnFrontendColumnRow({row}) {
    if(row.display_on_frontend == 1) {
        return <td><span>Yes</span></td>
    } else {
        return <td><span>No</span></td>
    }
}

function NameColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('attribute_name');
    }, []);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("attribute_name");
            else
                updateFilter("attribute_name", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'attribute_name') === -1 ? "" : filterInput.current.value;
    });

    return <th>
        <div className="table-header name-header">
            <div className={"title"}><span>Attribute name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Attribute name"}
                    className="form-control"
                />
            </div>
        </div>
    </th>
}

function NameColumnRow({row}) {
    return <td><span>{row.attribute_name}</span></td>
}

function CodeColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('attribute_code');
    }, []);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("attribute_code");
            else
                updateFilter("attribute_code", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'attribute_code') === -1 ? "" : filterInput.current.value;
    });

    return <th>
        <div className="table-header name-header">
            <div className={"title"}><span>Attribute code</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Attribute code"}
                    className="form-control"
                />
            </div>
        </div>
    </th>
}

function CodeColumnRow({row}) {
    return <td><span>{row.attribute_code}</span></td>
}

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
        areaProps.addField('deleteUrl');
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
    return <td>
        <div>
            <A url={row.editUrl}><i className="fas fa-edit"></i></A>
        </div>
        <div>
            <a className="text-danger"
               href={"javascript:void(0);"}
               onClick={
                   () => {
                       if (window.confirm('Are you sure?'))
                           Fetch(row.deleteUrl, false, 'GET');
                   }
               }>
                <i className="fas fa-trash-alt"></i>
            </a>
        </div>
    </td>
}

export default function AttributeGrid({apiUrl, areaProps})
{
    const [attributes, setAttributes] = React.useState([]);
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
                if(_.get(response, 'payload.data.attributeCollection.attributes')) {
                    setAttributes(_.get(response, 'payload.data.attributeCollection.attributes'));
                    setTotal(_.get(response, 'payload.data.attributeCollection.total'));
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

        return `{attributeCollection (filters : ${filterStr}) {attributes {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return <div className="attribute-grid mt-4">
        <table className="table table-bordered sticky">
            <thead>
                <tr>
                    <Area
                        className={""}
                        id={"attribute_grid_header"}
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
                                component: NameColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: CodeColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 25,
                                id: "code"
                            },
                            {
                                component: TypeColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 30,
                                id: "type"
                            },
                            {
                                component: IsRequiredColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 40,
                                id: "isRequired"
                            },
                            {
                                component: IsFilterableColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 45,
                                id: "isFilterable"
                            },
                            {
                                component: DisplayOnFrontendColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 50,
                                id: "display_on_frontend"
                            },
                            {
                                component: ActionColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 60,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            </thead>
            <tbody>
            {attributes.map((a, i)=> {
                return <tr>
                    <Area
                        key={i}
                        className={""}
                        id={"attribute_grid_row"}
                        row={a}
                        noOuter={true}
                        coreWidgets={[
                            {
                                component: IdColumnRow,
                                props : {row: a},
                                sort_order: 10,
                                id: "id"
                            },
                            {
                                component: NameColumnRow,
                                props : {row: a},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: CodeColumnRow,
                                props : {row: a},
                                sort_order: 25,
                                id: "code"
                            },
                            {
                                component: TypeColumnRow,
                                props : {row: a},
                                sort_order: 30,
                                id: "type"
                            },
                            {
                                component: IsRequiredColumnRow,
                                props : {row: a},
                                sort_order: 40,
                                id: "isRequired"
                            },
                            {
                                component: IsFilterableColumnRow,
                                props : {row: a},
                                sort_order: 45,
                                id: "isFilterable"
                            },
                            {
                                component: DisplayOnFrontendColumnRow,
                                props : {row: a},
                                sort_order: 50,
                                id: "display_on_frontend"
                            },
                            {
                                component: ActionColumnRow,
                                props : {row: a},
                                sort_order: 60,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            })}
            </tbody>
        </table>
        {attributes.length === 0 &&
        <div>There is no attribute to display</div>
        }
        <Pagination total={total} currentFilters={areaProps.filters} setFilter={areaProps.updateFilter}/>
    </div>
}