import Area from "../../../../../../../../js/production/area.js";
import { ReducerRegistry } from "../../../../../../../../js/production/reducer_registry.js";

const Name = ({ name }) => {
    return React.createElement(
        "h1",
        null,
        name
    );
};

const Description = ({ description }) => {
    return React.createElement(
        "div",
        null,
        description
    );
};

function reducer(categoryId = null, action = {}) {
    if (action.type === "JUSTATYPE") {
        if (action.payload.categoryId !== undefined) return action.payload.categoryId;
    }
    return categoryId;
}

ReducerRegistry.register('categoryId', reducer);

export default function CategoryInfo(props) {
    const dispatch = ReactRedux.useDispatch();
    React.useState(() => {
        dispatch({ 'type': "JUSTATYPE", 'payload': { 'categoryId': props.category_id } });
    });
    return React.createElement(Area, {
        id: "category-info",
        coreWidgets: [{
            component: Name,
            props: { name: props.name },
            sort_order: 10,
            id: "category-name"
        }, {
            component: Description,
            props: { description: props.description },
            sort_order: 20,
            id: "category-description"
        }]
    });
}