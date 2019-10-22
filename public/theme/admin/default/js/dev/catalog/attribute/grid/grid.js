import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";

function IdColumnHeader({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("attribute_id");
    }, []);

    return <td>
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
    </td>
}

function IdColumnRow({row}) {
    return <td><span>{row.attribute_id}</span></td>
}

function TypeColumnHeader({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("type");
    }, []);

    return <td>
        <div className="header status-header">
            <div className={"title"}><span>Type</span></div>
            <div className={"filter"}>
                <select className="uk-select" ref={filterInput} onChange={(e)=> {
                    areaProps.addFilter("type", "Equal", e.target.value);
                }}>
                    <option value={"select"}>Select</option>
                    <option value={"multiselect"}>Multi Select</option>
                    <option value={"text"}>Text</option>
                    <option value={"textarea"}>Textarea</option>
                    <option value={"date"}>Date</option>
                </select>
            </div>
        </div>
    </td>
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

function IsRequiredColumnHeader({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("is_required");
    }, []);

    return <td>
        <div className="header status-header">
            <div className={"title"}><span>Type</span></div>
            <div className={"filter"}>
                <select className="uk-select" ref={filterInput} onChange={(e)=> {
                    areaProps.addFilter("is_required", "Equal", e.target.value);
                }}>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
        </div>
    </td>
}

function IsRequiredColumnRow({row}) {
    if(row.is_required == 1) {
        return <td><span>Yes</span></td>
    } else {
        return <td><span>No</span></td>
    }
}

function NameColumnHeader({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('attribute_name');
    }, []);

    return <td>
        <div className="header name-header">
            <div className={"title"}><span>Attribute name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("name", "LIKE", `%${e.target.value}%`);}}
                    placeholder={"Attribute name"}
                />
            </div>
        </div>
    </td>
}

function NameColumnRow({row}) {
    return <td><span>{row.attribute_name}</span></td>
}

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
    }, []);
    return <td>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
        </div>
    </td>
}

function ActionColumnRow({row}) {
    return <td>
        <div><A url={_.get(row, 'editUrl' , '')} text={"Edit"}/></div>
    </td>
}

export default function AttributeGrid({apiUrl})
{
    const [attributes, setAttributes] = React.useState([]);
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
            if(_.get(response, 'data.payload.data.attributeCollection.attributes')) {
                setAttributes(_.get(response, 'data.payload.data.attributeCollection.attributes'));
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

        return `{attributeCollection ${filterStr} {attributes {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, filters]);

    return <div className={"uk-overflow-auto"}>
        <table className="uk-table uk-table-small">
            <thead>
            <Area
                className={""}
                id={"attribute_grid_header"}
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
                        component: NameColumnHeader,
                        props : {},
                        sort_order: 20,
                        id: "name"
                    },
                    {
                        component: TypeColumnHeader,
                        props : {},
                        sort_order: 30,
                        id: "type"
                    },
                    {
                        component: IsRequiredColumnHeader,
                        props : {},
                        sort_order: 40,
                        id: "isRequired"
                    },
                    {
                        component: ActionColumnHeader,
                        props : {},
                        sort_order: 50,
                        id: "action"
                    }
                ]}
            />
            </thead>
            <tbody>
            {attributes.map((c, i)=> {
                return <Area
                    key={i}
                    className={""}
                    id={"attribute_grid_row"}
                    row={c}
                    reactcomponent={"tr"}
                    coreWidgets={[
                        {
                            component: IdColumnRow,
                            props : {row: c},
                            sort_order: 10,
                            id: "id"
                        },
                        {
                            component: NameColumnRow,
                            props : {row: c},
                            sort_order: 20,
                            id: "name"
                        },
                        {
                            component: TypeColumnRow,
                            props : {row: c},
                            sort_order: 30,
                            id: "type"
                        },
                        {
                            component: IsRequiredColumnRow,
                            props : {row: c},
                            sort_order: 40,
                            id: "isRequired"
                        },
                        {
                            component: ActionColumnRow,
                            props : {row: c},
                            sort_order: 50,
                            id: "action"
                        }
                    ]}
                />
            })}
            </tbody>
        </table>
        {attributes.length === 0 &&
        <div>There is no attribute to display</div>
        }
    </div>
}