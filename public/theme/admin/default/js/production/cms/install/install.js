var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../js/production/fetch.js";
import { ADD_APP_STATE } from "../../../../../../../js/dev/event-types.js";

function InstallCmsModule() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/cms/migrate/install');
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const modules = ReactRedux.useSelector(state => _.get(state, 'appState.modules'));
    const setting = ReactRedux.useSelector(state => _.get(state, 'appState.modules.setting'));
    const cms = ReactRedux.useSelector(state => _.get(state, 'appState.modules.cms'));
    React.useEffect(() => {
        if (letsGo === true && cms === false && setting === true) {
            Fetch(api, false, 'POST', {}, null, response => {
                if (parseInt(response.success) === 1) dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { modules: _extends({}, modules, { cms: true }) } } });else dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { modules: _extends({}, modules, { cms: _.get(response, 'message', 'Something wrong') }) } } });
            });
        }
    }, [letsGo, cms, setting]);
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
                "Cms module "
            )
        ),
        modules.cms === true && React.createElement(
            "div",
            null,
            React.createElement("span", { className: "text-success", "uk-icon": "icon: check; ratio: 0.8" })
        ),
        modules.cms === undefined && React.createElement(
            "div",
            { className: "spinner", style: { width: '30px', height: '20px' } },
            React.createElement("div", { className: "rect1" }),
            React.createElement("div", { className: "rect2" }),
            React.createElement("div", { className: "rect3" }),
            React.createElement("div", { className: "rect4" }),
            React.createElement("div", { className: "rect5" })
        ),
        modules.cms !== true && modules.cms !== undefined && React.createElement(
            "div",
            { className: "text-danger" },
            modules.cms
        )
    );
}

export { InstallCmsModule };