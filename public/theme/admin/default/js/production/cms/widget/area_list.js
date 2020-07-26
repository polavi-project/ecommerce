import Area from "../../../../../../../js/production/area.js";
import Checkbox from "../../../../../../../js/production/form/fields/checkbox.js";
import Text from "../../../../../../../js/production/form/fields/text.js";

function AreaList({ selectedAreas = [], manualInputAreas = "", formId = '' }) {
    return React.createElement(Area, {
        id: "area-list",
        coreWidgets: [{
            'component': Checkbox,
            'props': {
                name: "area[header_top]",
                isChecked: selectedAreas.find(e => e === 'header_top') === undefined ? false : true,
                formId: formId,
                label: "Header top"
            },
            'sort_order': 5,
            'id': 'header-top-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[header]",
                isChecked: selectedAreas.find(e => e === 'header') === undefined ? false : true,
                formId: formId,
                label: "Header"
            },
            'sort_order': 10,
            'id': 'header-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[header_bottom]",
                isChecked: selectedAreas.find(e => e === 'header_bottom') === undefined ? false : true,
                formId: formId,
                label: "Header bottom"
            },
            'sort_order': 20,
            'id': 'header-bottom-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[content_top]",
                isChecked: selectedAreas.find(e => e === 'content_top') === undefined ? false : true,
                formId: formId,
                label: "Content top"
            },
            'sort_order': 30,
            'id': 'content-top-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[content_center]",
                isChecked: selectedAreas.find(e => e === 'content_center') === undefined ? false : true,
                formId: formId,
                label: "Content center"
            },
            'sort_order': 40,
            'id': 'content-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[content_bottom]",
                isChecked: selectedAreas.find(e => e === 'content_bottom') === undefined ? false : true,
                formId: formId,
                label: "Content bottom"
            },
            'sort_order': 50,
            'id': 'content-bottom-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[left_column]",
                isChecked: selectedAreas.find(e => e === 'left_column') === undefined ? false : true,
                formId: formId,
                label: "Left column"
            },
            'sort_order': 60,
            'id': 'left-column-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[right_column]",
                isChecked: selectedAreas.find(e => e === 'right_column') === undefined ? false : true,
                formId: formId,
                label: "Right column"
            },
            'sort_order': 70,
            'id': 'right-column-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[footer_top]",
                isChecked: selectedAreas.find(e => e === 'footer_top') === undefined ? false : true,
                formId: formId,
                label: "Footer top"
            },
            'sort_order': 80,
            'id': 'footer-top-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[footer]",
                isChecked: selectedAreas.find(e => e === 'footer') === undefined ? false : true,
                formId: formId,
                label: "Footer"
            },
            'sort_order': 90,
            'id': 'footer-area'
        }, {
            'component': Checkbox,
            'props': {
                name: "area[footer_bottom]",
                isChecked: selectedAreas.find(e => e === 'footer_bottom') === undefined ? false : true,
                formId: formId,
                label: "Footer bottom"
            },
            'sort_order': 100,
            'id': 'footer-bottom-area'
        }, {
            'component': Text,
            'props': {
                name: "area_manual_input",
                formId: formId,
                value: manualInputAreas,
                label: "Area keys (comma separated)"
            },
            'sort_order': 110,
            'id': 'footer-bottom-area'
        }]
    });
}

export { AreaList };