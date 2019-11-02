import {REQUEST_START, REQUEST_END, ADD_ALERT, UPDATE_WIDGETS, ADD_APP_STATE} from "./event-types.js"
import {store} from "./redux_store.js"

const Fetch = (url, pushState = false, method = "GET", data = {}, onStart = null, onComplete = null, onError = null, onFinally=null) => {
    if(url instanceof URL === false)
        url = new URL(url);
    url.searchParams.set('ajax', 1);

    PubSub.publishSync(REQUEST_START, {url, method, data});

    let config = {};
    if(method === "GET")
        config = {
            method: "GET",
            credentials: 'same-origin'
        };

    if(method === "POST") {
        let formData = data;
        if(data instanceof FormData === false) {
            formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data[key]));
        }
        config = {
            method: "POST",
            body: formData,
            credentials: 'same-origin'
        };
    }
    if(typeof onStart === 'function')
        onStart();
    fetch(url, config)
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Something wrong. Please try again");
            }
            return response.json();
        })
        .then(
            response => {
                if(response.redirectUrl !== undefined) {
                    window.location.assign(response.redirectUrl);
                    return true;
                }
                // Alerts
                if(response.alerts)
                    store.dispatch({'type': ADD_ALERT, 'payload': {alerts: response.alerts}});

                // App state
                if(response.appState)
                    store.dispatch({'type': ADD_APP_STATE, 'payload': {appState: response.appState}});

                let promises = [];
                let widgets = [];
                if(response.widgets !== undefined) {
                    let temps = response.widgets;
                    temps.forEach((widget, index)=> {
                        promises.push(
                            import(widget.template)
                                .then(component => {
                                    widgets.push({
                                        id: widget.id,
                                        org_id: widget.org_id,
                                        component: component.default,
                                        props: widget.props,
                                        area: widget.area,
                                        sort_order: widget.sort_order
                                    });
                                })
                        );
                    });
                }

                Promise.all(promises)
                    .then(() => {
                        if(widgets.length > 0)
                            store.dispatch({'type': UPDATE_WIDGETS, 'payload': {widgets: widgets, isNewPage: response.isNewPage === true}});
                    })
                    .catch((e) => {
                        console.log(e);
                        console.log(e.message);
                        console.log(e.fileName);
                        console.log(e.lineNumber);
                    }).finally(function() {
                        if(typeof onComplete === 'function')
                            onComplete(response);

                        if(pushState === true) {
                            url.searchParams.delete('ajax');
                            history.pushState(null, "", url);
                        }
                        PubSub.publishSync(REQUEST_END, {response});
                    });
            }
        ).catch(
            error => {
                console.log(error);
                if(typeof onError === 'function')
                    onError(error);
                store.dispatch({'type': ADD_ALERT, 'payload': {alerts: [{id: "server_error", message: 'Something wrong. Please try again', type: "error"}]}});
                PubSub.publishSync(REQUEST_END);
            }
        ).finally(() =>{
            if(typeof onFinally === 'function')
                onFinally();
        });
};

export {Fetch};