import A from "../a.js";
import {Fetch} from "../fetch.js"
import {PAGINATION_UPDATED} from "../event-types.js";
import Pagination from "./pagination.js";
import Area from "../area.js";

export default function Grid(props) {
    const [filters, setFilters] = React.useState(()=> {
        let filters = [];
        props.columns.forEach((i)=> {
            if(i.filterable === true)
                if(i.filter_type === 'range') {
                    filters[i.graphql_field + '_form'] = (props.filters && props.filters[i.graphql_field + '_form']) ? props.filters[i.graphql_field + '_form'] : '';
                    filters[i.graphql_field + '_to'] = (props.filters && props.filters[i.graphql_field + '_to']) ? props.filters[i.graphql_field + '_to'] : '';
                } else
                    filters[i.graphql_field] = (props.filters && props.filters[i.graphql_field]) ? props.filters[i.graphql_field] : '';
        });

        // For sorting
        filters['sort_by'] = (props.filters && props.filters['sort_by']) ? props.filters['sort_by'] : '';
        filters['sort_order'] = (props.filters && props.filters['sort_order']) ? props.filters['sort_order'] : '';
        filters['limit'] = (props.filters && props.filters['limit']) ? props.filters['limit'] : 20;
        filters['page'] = (props.filters && props.filters['page']) ? props.filters['page'] : 1;

        return filters;
    });
    const [canFilter, setCanFilter] = React.useState(false);

    const onChange = (e, index) => {
        setFilters({...filters, [index] : e.target.value});
        if(e.target.type === "select-one")
            setCanFilter(true);
    };

    const applyFilter = () => {
        let url = new URL(document.location);
        for (var key in filters) {
            if (filters.hasOwnProperty(key)) {
                if (filters[key]) {
                    url.searchParams.set(key, filters[key]);
                } else {
                    url.searchParams.delete(key);
                }
            } else
                url.searchParams.delete(key);
        }

        Fetch(url);
    };

    const applySort = (index) => {
        if(filters.sort_order === '') {
            setFilters({...filters, sort_by : index, sort_order : 'ASC'});
        } else
            setFilters({...filters, sort_by : index, sort_order : filters.sort_order === 'DESC' ? 'ASC' : 'DESC'});
        setCanFilter(true);
    };

    React.useEffect(() => {
        if(canFilter === true)
            applyFilter();
    });

    React.useEffect(() => {
        let token = PubSub.subscribe(PAGINATION_UPDATED, function(message, data) {
            if(data.gridId === props.id) {
                setFilters({...filters, limit : data.limit, page : data.currentPage});
                setCanFilter(true);
            }
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);

    const resetFilter = (e) => {
        let url = new URL(document.location);
        let keys = Object.keys(filters);
        for (var i = 0; i < keys.length; i++) {
            url.searchParams.delete(keys[i]);
        }
        Fetch(url);
    };

    return <div>
        <div className="grid-buttons">
            <Area id="grid_buttons" widgets={[]}/>
        </div>
        <Pagination gridId={props.id} total={props.total} limit={filters.limit} currentPage={filters.page}/>
        <table className="uk-table uk-table-divider uk-table-striped uk-table-small uk-table-justify">
            <thead>
            <tr className="name sort">
                {props.columns.map((col, index) => {
                    return <th key={index}>
                        <div>
                            <span>{col.name}</span>
                            {
                                col.sortable === true &&
                                <a href="javascript:void(0)" onClick={()=>applySort( col.graphql_field)}>
                                    {
                                        filters.sort_order === 'DESC' &&
                                        <span className="uk-icon" uk-icon="arrow-up"></span>
                                    }
                                    {
                                        filters.sort_order === 'ASC' &&
                                        <span className="uk-icon" uk-icon="arrow-down"></span>
                                    }
                                    {
                                        filters.sort_order === '' &&
                                        <span className="uk-icon" uk-icon="arrow-up"></span>
                                    }
                                </a>
                            }
                        </div>

                    </th>
                })}
            </tr>
            <tr className="filter">
                {props.columns.map((col, index) => {
                    return <td key={index}>
                        {
                            col.filterable === true &&
                            <div>
                                {col.filter_type === 'text' && <input className="uk-input uk-form-small"
                                                                      name={col.graphql_field}
                                                                      type="text"
                                                                      value={filters[col.graphql_field]}
                                                                      onChange={(e)=>onChange(e, col.graphql_field)}
                                                                      onKeyPress={(e)=>{ if(e.key === 'Enter') setCanFilter(true)}}/>}
                                {col.filter_type === 'range' &&
                                <div>
                                    Form: <input className="uk-input uk-form-small"
                                                 type="text"
                                                 name={ col.graphql_field + '_form'}
                                                 value={filters[col.graphql_field+ '_form']}
                                                 onKeyPress={(e)=>{ if(e.key === 'Enter') setCanFilter(true)}}
                                                 onChange={(e)=>onChange(e, col.graphql_field + '_form')}/>
                                    <br/>
                                    To: <input className="uk-input uk-form-small"
                                               type="text"
                                               name={col.graphql_field+ '_to'}
                                               value={filters[col.graphql_field+ '_to']}
                                               onKeyPress={(e)=>{ if(e.key === 'Enter') setCanFilter(true)}}
                                               onChange={(e)=>onChange(e, col.graphql_field + '_to')}/>
                                </div>}
                                {col.filter_type === 'select' &&
                                <select className="uk-select uk-form-small" name={col.graphql_field} onChange={(e)=>onChange(e, col.graphql_field)} value={filters[col.graphql_field]}>
                                    <option value="" disabled>Please select</option>
                                    {
                                        col.filter_options.map((o, i)=>{
                                            return <option key={i} value={o.value}>{o.text}</option>;
                                        })
                                    }
                                </select>
                                }
                            </div>
                        }
                        {
                            col.column === 'action' &&
                            <div>
                                <a className="uk-button uk-button-primary uk-button-small" onClick={(e)=>applyFilter(e)}><span>Apply</span></a><br/>
                                <a className="uk-button uk-button-danger uk-button-small" onClick={(e)=>resetFilter(e)}><span>Reset</span></a>
                            </div>
                        }
                    </td>
                })}
            </tr>
            </thead>
            <tbody>
            {props.rows.map((row, index)=>{
                return <tr key={index}>
                    {props.columns.map((col, i)=>{
                        if(col.column === 'action') {
                            return <td key={i}>
                                {
                                    row['action'].map((a, i) => {
                                        return React.createElement(A, { key: i, url: a.url, text: a.text });
                                    })
                                }
                            </td>
                        } else
                            return <td key={i}>
                                <span>{row[col.graphql_field]}</span>
                            </td>
                    })}
                </tr>
            })}
            {props.rows.length === 0 &&
            <tr>
                <td colSpan={props.columns.length}><span>There is no item to display</span></td>
            </tr>
            }
            </tbody>
        </table>
    </div>
}