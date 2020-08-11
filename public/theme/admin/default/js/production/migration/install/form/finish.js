import { Fetch } from "../../../../../../../../js/production/fetch.js";
import { ADD_APP_STATE } from "../../../../../../../../js/dev/event-types.js";

function FinishInstallation() {
    const dispatch = ReactRedux.useDispatch();
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/install/finish');
    const canFinish = ReactRedux.useSelector(state => {
        let flag = true;
        let modules = _.get(state, 'appState.modules', {});
        if (Object.keys(modules).length === 0) return false;
        for (let module of Object.keys(modules)) {
            if (modules[module] !== true) {
                flag = false;
                break;
            }
        }
        return flag;
    });
    const isDone = ReactRedux.useSelector(state => _.get(state, 'appState.installed'));
    React.useEffect(() => {
        if (canFinish === true) {
            Fetch(api, false, 'POST', {}, null, response => {
                if (parseInt(response.success) === 1) dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { installed: true } } });else dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { installed: _.get(response, 'message', 'Can not finish installation. Please check file permission (*/config/)') } } });
            });
        }
    });

    if (canFinish !== true) return null;

    return React.createElement(
        "li",
        { className: "uk-grid uk-width-expand" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Finishing "
            )
        ),
        isDone === true && React.createElement(
            "div",
            null,
            React.createElement("span", { className: "text-success", "uk-icon": "icon: check; ratio: 0.8" })
        ),
        isDone === undefined && React.createElement(
            "div",
            { className: "spinner", style: { width: '30px', height: '20px' } },
            React.createElement("div", { className: "rect1" }),
            React.createElement("div", { className: "rect2" }),
            React.createElement("div", { className: "rect3" }),
            React.createElement("div", { className: "rect4" }),
            React.createElement("div", { className: "rect5" })
        ),
        isDone !== true && isDone !== undefined && React.createElement(
            "div",
            { className: "text-danger" },
            isDone
        )
    );
}

export { FinishInstallation };