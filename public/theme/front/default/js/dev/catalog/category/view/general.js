import Area from "../../../../../../../../js/production/area.js";

const Name = ({name}) => {
    return <h1 className="category-name">{name}</h1>
};

const Description = ({description}) => {
    return <div className="category-description">{description}</div>
};

export default function CategoryInfo(props) {
    return <div className="container">
        <Area
            id={"category-general-info"}
            className="category-general-info"
            coreWidgets={[
                {
                    component: Name,
                    props : {name: props.name},
                    sort_order: 10,
                    id: "category-name"
                },
                {
                    component: Description,
                    props : {description: props.description},
                    sort_order: 20,
                    id: "category-description"
                }
            ]}
        />
    </div>
}