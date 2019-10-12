export default class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: []
        }
    }

    componentDidMount() {
        this.setState({
            category: this.props.assigned_cats
        })
    }

    onChange(e) {
        let category = this.state.category;
        let index = null;
        if (e.target.checked) {
            category.push(+e.target.value)
        } else {
            index = category.indexOf(+e.target.value);
            category.splice(index, 1)
        }
        this.setState({ category: category })
    }

    render() {
        let category = JSON.stringify(this.state.category);
        return <div>
                <span>Category</span><br/>
            <ul>
                {this.props.categories.map((category, index)=> {
                    return <li key={index}>
                        <label><input className="uk-checkbox" type="checkbox" defaultChecked={this.props.assigned_cats.indexOf(category.id) !== -1} value={category.id} onChange={(e) => this.onChange(e)}/> <span>{category.name}</span></label>
                    </li>
                })}
            </ul>
            <input type="hidden" value={category} name="category"/>
        </div>;
    }
}