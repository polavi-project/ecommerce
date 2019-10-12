import {REQUEST_END} from "../../../../../../../js/dev/event-types.js";

const CmsPage = (props) => {
    const {id, name, content} = props;

    return (
        <div className={"cms-page cms-page-" + id}>
            <h1 className="cms-page-heading">{name}</h1>
            <div className="cms-page-content" dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
    );
};

export default CmsPage;