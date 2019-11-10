import {Fetch} from "../../../../../../../js/production/fetch.js";
import {ADD_APP_STATE} from "../../../../../../../js/dev/event-types.js";

function InstallSettingModule() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/setting/migrate/install');
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const modules = ReactRedux.useSelector(state => _.get(state, 'appState.modules'));
    React.useEffect(()=> {
        if(letsGo === true) {
            Fetch(api, false, 'POST', {}, null, (response) => {
                if(parseInt(response.success) === 1)
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {modules: {...modules, setting: true}}}});
                else
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {modules: {...modules, setting: _.get(response, 'message', 'Something wrong')}}}});
            });
        }
    }, [letsGo]);
    if(letsGo !== true)
        return null;


    return <li className="uk-grid uk-width-expand">
        <div>
            <span>Basic setting </span>
        </div>
        {modules.setting === true && <div><span className="text-success" uk-icon="icon: check; ratio: 0.8"></span></div>}
        {modules.setting === undefined && <div className="spinner" style={{width: '30px', height: '20px'}}>
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
        </div>}
        {(modules.setting !== true && modules.setting !== undefined) && <div className="text-danger">{modules.setting}</div> }
    </li>
}

export {InstallSettingModule}