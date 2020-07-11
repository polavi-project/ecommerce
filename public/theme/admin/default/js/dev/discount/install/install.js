import {Fetch} from "../../../../../../../js/production/fetch.js";
import {ADD_APP_STATE} from "../../../../../../../js/dev/event-types.js";

function InstallDiscountModule() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/discount/migrate/install');
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const modules = ReactRedux.useSelector(state => _.get(state, 'appState.modules'));
    const order = ReactRedux.useSelector(state => _.get(state, 'appState.modules.order'));
    const discount = ReactRedux.useSelector(state => _.get(state, 'appState.modules.discount'));
    React.useEffect(()=> {
        if(letsGo === true && order === true && discount === false) {
            Fetch(api, false, 'POST', {}, null, (response) => {
                if(parseInt(response.success) === 1)
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {modules: {...modules, discount: true}}}});
                else
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {modules: {...modules, discount: _.get(response, 'message', 'Something wrong')}}}});
            });
        }
    }, [letsGo, order, discount]);
    if(letsGo !== true)
        return null;


    return <li className="uk-grid uk-width-expand">
        <div>
            <span>Discount module </span>
        </div>
        {modules.discount === true && <div><span className="text-success" uk-icon="icon: check; ratio: 0.8"></span></div>}
        {modules.discount === false && <div className="spinner" style={{width: '30px', height: '20px'}}>
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
        </div>}
        {(modules.discount !== true && modules.discount !== false) && <div className="text-danger">{modules.discount}</div> }
    </li>
}

export {InstallDiscountModule}