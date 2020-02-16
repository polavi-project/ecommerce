import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

function IdColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField("cms_page_id");
    }, []);

    return <th>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.cms_page_id}</span></td>;
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

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('cms_page_id');
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

export default function CmsPageGrid({apiUrl, areaProps})
{
    const [pages, setPages] = React.useState([]);
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
                if(_.get(response, 'payload.data.pageCollection.pages')) {
                    setPages(_.get(response, 'payload.data.pageCollection.pages'));
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

        return `{pageCollection ${filterStr} {pages {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return <div className={"uk-overflow-auto"}>
        <table className="uk-table uk-table-small uk-table-divider">
            <thead>
            <Area
                className={""}
                id={"page_grid_header"}
                filters={areaProps.filters}
                addFilter={areaProps.addFilter}
                updateFilter={areaProps.updateFilter}
                removeFilter={areaProps.removeFilter}
                cleanFilter={areaProps.cleanFilter}
                addField={addField}
                applyFilter={applyFilter}
                reactcomponent={"tr"}
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
                        component: StatusColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 30,
                        id: "status"
                    },
                    {
                        component: ActionColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 40,
                        id: "action"
                    }
                ]}
            />
            </thead>
            <tbody>
            {pages.map((p, i)=> {
                return <Area
                    key={i}
                    className={""}
                    id={"page_grid_row"}
                    row={p}
                    reactcomponent={"tr"}
                    coreWidgets={[
                        {
                            component: IdColumnRow,
                            props : {row: p},
                            sort_order: 10,
                            id: "id"
                        },
                        {
                            component: NameColumnRow,
                            props : {row: p},
                            sort_order: 20,
                            id: "name"
                        },
                        {
                            component: StatusColumnRow,
                            props : {row: p},
                            sort_order: 30,
                            id: "status"
                        },
                        {
                            component: ActionColumnRow,
                            props : {row: p},
                            sort_order: 40,
                            id: "action"
                        }
                    ]}
                />
            })}
            </tbody>
        </table>
        {pages.length === 0 &&
        <div>There is no page to display</div>
        }
    </div>
}