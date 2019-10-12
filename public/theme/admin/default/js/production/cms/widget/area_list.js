import Area from "../../../../../../../js/production/area.js";
import Checkbox from "../../../../../../../js/production/form/fields/checkbox.js";

function AreaList({ selectedAreas = [], formId = '' }) {
    return React.createElement(Area, {
        id: "area-list",
        coreWidgets: [{
            'component': Checkbox,
            'props': {
                name: "area[leftColumn]",
                isChecked: selectedAreas.find(e => e === 'leftColumn') === undefined ? false : true,
                formId: formId,
                label: "Left column"
            },
            'sort_order': 10,
            'id': 'leftColumn-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[rightColumn]",
                isChecked: selectedAreas.find(e => e === 'rightColumn') === undefined ? false : true,
                formId: formId,
                label: "Right column"
            },
            'sort_order': 10,
            'id': 'rightColumn-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[content]",
                isChecked: selectedAreas.find(e => e === 'content') === undefined ? false : true,
                formId: formId,
                label: "Content"
            },
            'sort_order': 20,
            'id': 'content-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[footer]",
                isChecked: selectedAreas.find(e => e === 'footer') === undefined ? false : true,
                formId: formId,
                label: "Footer"
            },
            'sort_order': 30,
            'id': 'footer-area'
        }]
    });
}

export { AreaList };