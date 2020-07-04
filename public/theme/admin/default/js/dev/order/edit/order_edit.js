import Area from "../../../../../../../js/production/area.js";

export default function OrderEdit() {
    return <div className='row order-edit-page'>
        <Area
            id='order_edit_left'
            className='col-8'
            coreWidgets={[]}
        />
        <Area
            id='order_edit_right'
            className='col-4'
            coreWidgets={[]}
        />
    </div>
}