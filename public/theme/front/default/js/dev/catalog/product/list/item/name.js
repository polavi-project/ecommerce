import A from "../../../../../../../../../js/production/a.js";
const Name = ({name, url}) => {
    return <div className="product-name product-list-name">
        <A classes={"uk-link"} url={url}><span>{name}</span></A>
    </div>
};
export {Name};