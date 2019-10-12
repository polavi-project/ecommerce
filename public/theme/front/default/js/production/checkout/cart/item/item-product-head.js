class Item extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    onClick(e) {
        e.preventDefault();
        this.setState({
            active: !this.state.active
        });
    }

    render() {
        const { items } = this.props;
        return React.createElement(
            "div",
            { id: this.props.id, className: this.props.id + "-content-inner item-list" },
            React.createElement(
                "table",
                null,
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "td",
                            { rowSpan: 1 },
                            React.createElement(
                                "span",
                                null,
                                "Product"
                            )
                        ),
                        React.createElement(
                            "td",
                            { rowSpan: 1 },
                            React.createElement(
                                "span",
                                null,
                                " "
                            )
                        ),
                        React.createElement(
                            "td",
                            { rowSpan: 1 },
                            React.createElement(
                                "span",
                                null,
                                "Price"
                            )
                        ),
                        React.createElement(
                            "td",
                            { rowSpan: 1 },
                            React.createElement(
                                "span",
                                null,
                                "Qty"
                            )
                        ),
                        React.createElement(
                            "td",
                            { rowSpan: 1 },
                            React.createElement(
                                "span",
                                null,
                                "Subtotal"
                            )
                        )
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    items.map(item => {
                        return React.createElement(
                            "tr",
                            { key: item.id },
                            React.createElement("td", null)
                        );
                    })
                )
            )
        );
    }
}
Items.propTypes = {
    widgets: PropTypes.arrayOf(PropTypes.shape({
        component: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired
    }))
};

const getWidgets = (widgets, id) => {
    let term = widgets !== undefined ? widgets.filter(e => {
        return e.area === id;
    }) : [];
    return term.sort(function (obj1, obj2) {
        return obj1.sort_order - obj2.sort_order;
    });
};

const mapStateToProps = (state, ownProps) => {
    return {
        widgets: getWidgets(state.widgets, ownProps.id),
        type: state.type
    };
};

export default ReactRedux.connect(mapStateToProps)(Items);