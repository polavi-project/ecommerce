const Description = ({description}) => {
    return <li>
        <a className={"uk-accordion-title"} href={"#"}>Description</a>
        <div className={"uk-accordion-content"}>{description}</div>
    </li>
};

export default Description;