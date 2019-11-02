import Area from "../../../../../../../js/production/area.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";

function EditForm({displayForm, requestUrl}) {
    return <div>
        <Area id="widget-edit-form" displayForm={displayForm} requestUrl={requestUrl}/>
    </div>
}
function WidgetTypeSelector({types, selectedType = '', requestUrl, showEdit = 0}) {
    const [showEditForm, setShowEditForm] = React.useState(showEdit);
    const [type, setType] = React.useState(selectedType);
    const [showError, setShowError] = React.useState(false);

    const onSelect = (e) => {
        setType(e.target.value);
        let url = requestUrl + `/${e.target.value}`;
        Fetch(url, true, 'GET');
    };

    const displayForm = (e) => {
        e.preventDefault();
        if(!type)
            setShowError(true);
        else {
            setShowError(false);
            setShowEditForm(1);
        }
    };

    return <div>
        <div>Please select widget type</div>
        <select
            className="uk-select uk-form-small"
            onChange={(e) => onSelect(e)}
            value={type}
            style={{maxWidth: "200px"}}
        ><option value={''}>Select widget type</option>
            {types.map((w, i) => {
                return <option key={i} value={w.code}>{w.name}</option>
            })}
        </select>
        {showError && <div><span>Please select widget type</span></div>}
        {showEditForm === 1 && <EditForm displayForm={displayForm} requestUrl={requestUrl}/>}
        {showEditForm === 0 && <div><a href="#" className="uk-button-primary uk-button-small" onClick={(e) => displayForm(e)}><span>Add new</span></a></div>}
    </div>
}

export {WidgetTypeSelector}