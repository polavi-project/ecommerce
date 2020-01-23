import A from "../../../../../../../../js/production/a.js";
import {ADD_ALERT} from "../../../../../../../../js/production/event-types.js";

export default function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('product_id');
        areaProps.addField('editUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return <th className={"column"}>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
            <a onClick={()=>onClick()}>Clean filter</a>
        </div>
    </th>
}