export default function TextWidget({id, name, content}) {
    return <div className={id + "-text-widget text-widget-container"} dangerouslySetInnerHTML={{__html: content}}>
    </div>
}