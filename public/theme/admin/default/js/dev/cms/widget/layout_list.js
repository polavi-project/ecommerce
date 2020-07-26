import Checkbox from "../../../../../../../js/production/form/fields/checkbox.js";

function LayoutList({selectedLayouts = [], formId = ''}) {

    const layouts = ReactRedux.useSelector(state => _.get(state, 'appState.layouts', []));
    return <div className="widget-edit-layouts">
        <Checkbox
            name={`layout[all]`}
            isChecked={selectedLayouts.find((e) => e === "all") !== undefined}
            formId={formId}
            label={"All page"}
        />
        {layouts.map((l, i)=> {
            return <Checkbox
                name={`layout[${l}]`}
                isChecked={selectedLayouts.find((e) => e === l) !== undefined}
                formId={formId}
                label={l.replace(/\./gi, " ").replace(/\b\w/g, l => l.toUpperCase())}
            />
        })}
    </div>;
}

export {LayoutList}