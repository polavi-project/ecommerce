import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";
import Pagination from "../../../../../../../../js/production/grid/pagination.js";

function IdColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField("attribute_group_id");
    }, []);

    return <th>
        <div className="table-header id-header">
            <div className={"title"}><span>ID</span></div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.attribute_group_id}</span></td>
}

function NameColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('group_name');
    }, []);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("group_name");
            else
                updateFilter("group_name", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'group_name') === -1 ? "" : filterInput.current.value;
    });

    return <th>
        <div className="table-header name-header">
            <div className={"title"}><span>Group name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Group name"}
                    className="form-control"
                />
            </div>
        </div>
    </th>
}

function NameColumnRow({row}) {
    return <td><span>{row.group_name}</span></td>
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

export default function AttributeGroupGrid({apiUrl, areaProps})
{
    const [groups, setGroups] = React.useState([]);
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
                if(_.get(response, 'payload.data.attributeGroupCollection.groups')) {
                    setGroups(_.get(response, 'payload.data.attributeGroupCollection.groups'));
                    setTotal(_.get(response, 'payload.data.attributeGroupCollection.total'));
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

        return `{attributeGroupCollection (filters : ${filterStr}) {groups {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return <div className={"attribute-group-grid mt-4"}>
        <table className="table table-bordered sticky">
            <thead>
                <tr>
                    <Area
                        className={""}
                        id={"attribute_group_grid_header"}
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
                                component: ActionColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 30,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            </thead>
            <tbody>
            {groups.map((g, i)=> {
                return <tr>
                    <Area
                        key={i}
                        className={""}
                        id={"attribute_group_grid_row"}
                        row={g}
                        noOuter={true}
                        coreWidgets={[
                            {
                                component: IdColumnRow,
                                props : {row: g},
                                sort_order: 10,
                                id: "id"
                            },
                            {
                                component: NameColumnRow,
                                props : {row: g},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: ActionColumnRow,
                                props : {row: g},
                                sort_order: 30,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            })}
            </tbody>
        </table>
        {groups.length === 0 &&
        <div>There is no group to display</div>
        }
        <Pagination total={total} page={_.get(areaProps.filters.find((e)=> e.key === 'page'), 'value', 1)} limit={_.get(areaProps.filters.find((e)=> e.key === 'limit'), 'value', 20)} setFilter={areaProps.updateFilter}/>
    </div>
}