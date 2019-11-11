import {Fetch} from "../../../../../../../js/production/fetch.js";
import {ADD_APP_STATE} from "../../../../../../../js/dev/event-types.js";

function InstallTaxModule() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/tax/migrate/install');
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const modules = ReactRedux.useSelector(state => _.get(state, 'appState.modules'));
    const tax = ReactRedux.useSelector(state => _.get(state, 'appState.modules.tax'));
    React.useEffect(()=> {
        if(letsGo === true && tax === false) {
            Fetch(api, false, 'POST', {}, null, (response) => {
                if(parseInt(response.success) === 1)
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {modules: {...modules, tax: true}}}});
                else
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {modules: {...modules, tax: _.get(response, 'message', 'Something wrong')}}}});
            });
        }
    }, [letsGo, tax]);
    if(letsGo !== true)
        return null;


    return <li className="uk-grid uk-width-expand">
        <div>
            <span>Tax module </span>
        </div>
        {modules.tax === true && <div><span className="text-success" uk-icon="icon: check; ratio: 0.8"></span></div>}
        {modules.tax === false && <div className="spinner" style={{width: '30px', height: '20px'}}>
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
        </div>}
        {(modules.tax !== true && modules.tax !== false) && <div className="text-danger">{modules.tax}</div> }
    </li>
}

export {InstallTaxModule}