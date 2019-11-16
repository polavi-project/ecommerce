import {PAGINATION_UPDATED} from "./../event-types.js"

export default function Pagination({}) {
    const [limit, setLimit] = React.useState(props.limit);
    const [currentPage, setCurrentPage] = React.useState(props.currentPage);
    const [ready, setReady] = React.useState(false);

    const getTotalPage = () => {
        if(props.total % limit > 0)
            return Math.floor(props.total / limit) + 1;
        return props.total / limit;
    };

    const changeCurrentPage = (page)=> {
        if(isNaN(page) || page < 1 || page > getTotalPage())
            return false;
        setCurrentPage(page);
        setReady(true);
    };

    React.useEffect(() => {
        if(ready === true) {
            PubSub.publishSync(PAGINATION_UPDATED, {limit, currentPage, gridId: props.gridId});
            setReady(false);
        }
    });

    return <div className="pagination">
        <div className="uk-inline">
            <a className="uk-form-icon uk-form-icon-flip"
               href="javascript:void(0)"
               uk-icon="icon: refresh"
               onClick={()=> setReady(true)}
            ></a>
            <input className="uk-input uk-form-small"
                   id="pagination-limit"
                   type="text"
                   name="limit"
                   value={limit}
                   onKeyPress={(e)=>{ if(e.key === 'Enter') setReady(true)}}
                   onChange={(e)=> setLimit(e.target.value)}/>
        </div>
        <div className="uk-inline">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <a href="javascript:void(0)"
                               uk-icon="icon: chevron-left"
                               onClick={()=>changeCurrentPage(parseInt(currentPage) - 1)}
                            ></a>
                        </td>
                        <td>
                            <div className="uk-inline">
                                <span className="uk-form-icon uk-form-icon-flip"
                                ><span>of {getTotalPage()}</span></span>
                                <input className="uk-input uk-form-small"
                                       id="pagination-current-page"
                                       type="text"
                                       name="current_page"
                                       value={currentPage}
                                       onKeyPress={(e)=>{ if(e.key === 'Enter') setReady(true)}}
                                       onChange={(e)=> changeCurrentPage(e.target.value)}/>
                            </div>
                        </td>
                        <td>
                            <a href="javascript:void(0)"
                               uk-icon="icon: chevron-right"
                               onClick={()=>changeCurrentPage(parseInt(currentPage) + 1)}
                            ></a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}