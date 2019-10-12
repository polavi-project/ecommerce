var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "./fetch.js";

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        let url = new URL(document.location);
        let page = parseInt(url.searchParams.get('page'));
        if (page <= 0 || isNaN(page)) page = 1;
        this.state = { page: page };
    }

    onClick(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        Fetch(dispatch, this.props.url);
    }

    onPrev(e) {
        e.preventDefault();
        let page = this.state.page - 1;
        if (page <= 0) return;
        this.setState({ page });
        let url = new URL(document.location);
        url.searchParams.set('page', page);
        const { dispatch } = this.props;
        Fetch(dispatch, url);
    }

    onNext(e) {
        e.preventDefault();
        let page = this.state.page + 1;
        this.setState(_extends({}, this.state, { page }));
        let url = new URL(document.location);
        url.searchParams.set('page', page);
        const { dispatch } = this.props;
        Fetch(dispatch, url);
    }

    onChange(e) {
        e.preventDefault();
        this.setState({ page: e.target.value });
    }

    render() {
        const { total } = this.props;
        return React.createElement(
            'div',
            null,
            React.createElement(
                'a',
                { className: 'prev-page', onClick: this.onPrev.bind(this) },
                React.createElement(
                    'span',
                    null,
                    'Prev'
                )
            ),
            React.createElement('input', { type: 'text', value: this.state.page, onChange: this.onChange.bind(this) }),
            React.createElement(
                'a',
                { className: 'next-page', onClick: this.onNext.bind(this) },
                React.createElement(
                    'span',
                    null,
                    'Next'
                )
            ),
            React.createElement(
                'span',
                null,
                'Total ',
                total,
                ' records found'
            )
        );
    }
}

export default ReactRedux.connect()(Pagination);