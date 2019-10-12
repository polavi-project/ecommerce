export default class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: []
        };
    }

    componentDidMount() {
        this.setState({
            category: this.props.assigned_cats
        });
    }

    onChange(e) {
        let category = this.state.category;
        let index = null;
        if (e.target.checked) {
            category.push(+e.target.value);
        } else {
            index = category.indexOf(+e.target.value);
            category.splice(index, 1);
        }
        this.setState({ category: category });
    }

    render() {
        let category = JSON.stringify(this.state.category);
        return React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Category"
            ),
            React.createElement("br", null),
            React.createElement(
                "ul",
                null,
                this.props.categories.map((category, index) => {
                    return React.createElement(
                        "li",
                        { key: index },
                        React.createElement(
                            "label",
                            null,
                            React.createElement("input", { className: "uk-checkbox", type: "checkbox", defaultChecked: this.props.assigned_cats.indexOf(category.id) !== -1, value: category.id, onChange: e => this.onChange(e) }),
                            " ",
                            React.createElement(
                                "span",
                                null,
                                category.name
                            )
                        )
                    );
                })
            ),
            React.createElement("input", { type: "hidden", value: category, name: "category" })
        );
    }
}