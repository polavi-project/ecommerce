import { Helmet } from "../production/Helmet.js";

function Head() {
    const helmet = ReactRedux.useSelector(state => _.get(state, 'appState.helmet', {}));

    return React.createElement(Helmet, {
        title: helmet.title,
        meta: helmet.metas,
        link: helmet.links,
        script: helmet.scripts
    });
}

export { Head };