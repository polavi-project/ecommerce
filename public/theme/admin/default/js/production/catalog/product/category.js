export default class Category extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.category);
        this.state = {
            category: props.category
        };
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
            { className: "group-form" },
            React.createElement(
                "div",
                { className: "group-form-title" },
                React.createElement(
                    "span",
                    null,
                    "Category"
                )
            ),
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
                            React.createElement("input", { type: "checkbox", defaultChecked: this.state.category.indexOf(parseInt(category.id)) !== -1, value: category.id, onChange: e => this.onChange(e) }),
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