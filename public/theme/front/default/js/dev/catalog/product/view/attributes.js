const Attributes = ({attributes}) => {
    return <li><a className={"uk-accordion-title"} href={"#"}>Specification</a>
        <ul className={"uk-accordion-content"}>
            {attributes.map((attribute, index)=>{
                return <li key={index}><strong>{attribute.attribute_name} : </strong> <span>{attribute.attribute_value_text}</span></li>
            })}
        </ul>
    </li>
};
export default Attributes;