const Attributes = ({attributes}) => {
    return <div><strong>Attributes</strong><br/>
        <ul>
            {attributes.map((attribute, index)=>{
                return <li key={index}><strong>{attribute.attribute_name} : </strong> <span>{attribute.attribute_value_text}</span></li>
            })}
        </ul>
    </div>
};
export default Attributes;