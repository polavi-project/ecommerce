var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../js/production/fetch.js";
import { ADD_APP_STATE } from "../../../../../../../js/dev/event-types.js";

function InstallCustomerModule() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/customer/migrate/install');
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const modules = ReactRedux.useSelector(state => _.get(state, 'appState.modules'));
    const customer = ReactRedux.useSelector(state => _.get(state, 'appState.modules.customer'));
    React.useEffect(() => {
        if (letsGo === true && customer === false) {
            Fetch(api, false, 'POST', {}, null, response => {
                if (parseInt(response.success) === 1) dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { modules: _extends({}, modules, { customer: true }) } } });else dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { modules: _extends({}, modules, { customer: _.get(response, 'message', 'Something wrong') }) } } });
            });
        }
    }, [letsGo, customer]);
    if (letsGo !== true) return null;

    return React.createElement(
        "li",
        { className: "uk-grid uk-width-expand" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Customer module "
            )
        ),
        modules.customer === true && React.createElement(
            "div",
            null,
            React.createElement("span", { className: "text-success", "uk-icon": "icon: check; ratio: 0.8" })
        ),
        modules.customer === undefined && React.createElement(
            "div",
            { className: "spinner", style: { width: '30px', height: '20px' } },
            React.createElement("div", { className: "rect1" }),
            React.createElement("div", { className: "rect2" }),
            React.createElement("div", { className: "rect3" }),
            React.createElement("div", { className: "rect4" }),
            React.createElement("div", { className: "rect5" })
        ),
        modules.customer !== true && modules.customer !== undefined && React.createElement(
            "div",
            { className: "text-danger" },
            modules.customer
        )
    );
}

export { InstallCustomerModule };