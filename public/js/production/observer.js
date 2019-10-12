class EventObserver {
    constructor() {
        this.observers = [];
    }

    subscribe(event_name, callback, priority) {
        let pri = parseInt(priority);
        if(pri < 0)
            throw "Invalid priority";
        // Check if priority already existed
        if(this.observers[event_name] === undefined) {
            this.observers[event_name] = [];
            this.observers[event_name].push(callback);
            return;
        }
        if(!this.observers[event_name][pri]) {
            this.observers[event_name].push(callback);
        } else {
            this.observers[event_name].splice(pri + 1, 0, callback);
        }
    }

    unsubscribe(fn) {
        this.handlers = this.handlers.filter(
            function(item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    }

    dispatch(event_name, obj, ...args ) {
        let scope = obj || window;
        console.log('fire event ' + event_name);
        if(!this.observers[event_name])
            return;
        let listeners = this.observers[event_name];
        let val = '';
        listeners.forEach(function(func) {
            val = func.call(scope, ...args);
        });
        return val;
    }
}
let eventDispatcher = new EventObserver();
function add_listener(event_name, callable, priority) {
    eventDispatcher.subscribe(event_name, callable, priority);
}

function fire_event(event_name, obj, ...args) {
    return eventDispatcher.dispatch(event_name, obj, ...args)
}

add_listener('app_init', function() {
    let state = {...this.state};
    state.layout = 'two-columns-left';
    this.state = state;
}, 0);

add_listener('app_init', function() {
    console.log('App init 1');
}, 1);

add_listener('app_init', function() {
    console.log('App init 2');
}, 2);

add_listener('app_init', function() {
    console.log('App init 3');
}, 3);

add_listener('app_init', function(component, abc) {
    console.log('App init 4');
    console.log(component);
    console.log(abc);
}, 2);
