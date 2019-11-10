import {Fetch} from "../../../../../../../js/production/fetch.js";
import {ADD_APP_STATE} from "../../../../../../../js/dev/event-types.js";

function InstallCmsModule() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/cms/migrate/install');
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const modules = ReactRedux.useSelector(state => _.get(state, 'appState.modules'));
    React.useEffect(()=> {
        if(letsGo === true) {
            Fetch(api, false, 'POST', {}, null, (response) => {
                if(parseInt(response.success) === 1)
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {modules: {...modules, cms: true}}}});
                else
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {modules: {...modules, cms: _.get(response, 'message', 'Something wrong')}}}});
            });
        }
    }, [letsGo]);
    if(letsGo !== true)
        return null;


    return <li className="uk-grid uk-width-expand">
        <div>
            <span>Cms module </span>
        </div>
        {modules.cms === true && <div><span className="text-success" uk-icon="icon: check; ratio: 0.8"></span></div>}
        {modules.cms === undefined && <div className="spinner" style={{width: '30px', height: '20px'}}>
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
        </div>}
        {(modules.cms !== true && modules.cms !== undefined) && <div className="text-danger">{modules.cms}</div> }
    </li>
}

export {InstallCmsModule}