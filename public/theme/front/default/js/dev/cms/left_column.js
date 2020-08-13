import Area from "../../../../../../js/production/area.js";

export default function LeftColumn(props) {
    const getWidgets = (widgets) => {
        return widgets !== undefined ? widgets.filter((e)=> {
            return e.area === props.id;
        }) : [];
    };
    const widgets = ReactRedux.useSelector(state => getWidgets(state.widgets));
    const [open, setOpen] = React.useState(false);

    return <React.Fragment>
        {widgets.length > 0 && <div className="left-column-opener column-opener d-block d-lg-none d-xl-none">
            <a href={"#"} onClick={(e) => {e.preventDefault(); setOpen(!open);}}><i className="fas fa-sign-in-alt"></i></a>
        </div>}
        <Area {...props} className={open === true? "col-12 col-md-3 left-column open" : "col-12 col-md-3 left-column"} />
    </React.Fragment>
}