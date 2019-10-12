import {ADD_CHILD_COMPONENT} from "./event-types.js";

function ComponentFactory(id, ReactComponent) {
    let _this = this;
    _this.children = [];
    _this.addChild = function(ReactElement, sort_order) {
        if(React.isValidElement(ReactElement) === false)
            throw new Error("Invalid component");
        if(sort_order === undefined)
            sort_order = 0;
        let s = parseInt(sort_order);
        if(s < 0)
            return;

        if(_this.children[s] === undefined )
            _this.children[s] = [];
        _this.children[s].push(ReactElement);
    };

    _this.create = function create() {
        PubSub.publishSync(ADD_CHILD_COMPONENT, {id, factory: _this});
        function Component$Wrapper() {}
        Component$Wrapper.prototype = Object.create(React.Component.prototype);
        Component$Wrapper.__proto__ = React.Component;
        Component$Wrapper.prototype.constructor = Component$Wrapper;
        console.log(_this.children);
        let child = [];
        _this.children.forEach(function(e) {
            if(e instanceof Array) {
                e.forEach(function(c) {
                    child.push(c);
                })
            } else {
                child.push(e);
            }
        });
        Component$Wrapper.prototype.render = function render() {
            return React.createElement(ReactComponent, {child: child, ...this.props})
        };

        return Component$Wrapper;
    };

    return _this;
}

export {ComponentFactory}