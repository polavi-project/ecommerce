import {Fetch} from "../../../../../../../../js/production/fetch.js";
import {ADD_APP_STATE} from "../../../../../../../../js/dev/event-types.js";

function FinishInstallation() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/install/finish');
    const canFinish = ReactRedux.useSelector((state) => {
        let flag = true;
        let modules = _.get(state, 'appState.modules', {});
        if(Object.keys(modules).length === 0)
            return false;
        for (let module of Object.keys(modules)) {
            if(modules[module] !== true) {
                flag = false;
                break;
            }
        }
        return flag;
    });
    const isDone = ReactRedux.useSelector(state => _.get(state, 'appState.installed'));
    React.useEffect(()=> {
        if(canFinish === true) {
            Fetch(api, false, 'POST', {}, null, (response) => {
                if(parseInt(response.success) === 1)
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {installed: true}}});
                else
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {installed: _.get(response, 'message', 'Can not finish installation. Please check file permission (*/config/)')}}});
            });
        }
    });

    if(canFinish !== true)
        return null;


    return <li className="uk-grid uk-width-expand">
        <div>
            <span>Finishing </span>
        </div>
        {isDone === true && <div><span className="text-success" uk-icon="icon: check; ratio: 0.8"></span></div>}
        {isDone === undefined && <div className="spinner" style={{width: '30px', height: '20px'}}>
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
        </div>}
        {(isDone !== true && isDone !== undefined) && <div className="text-danger">{isDone}</div> }
    </li>
}

export {FinishInstallation}