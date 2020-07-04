export default function TextWidget({id, name, content, containerClass}) {
    return <div className={id + "-text-widget text-widget-container " + containerClass} dangerouslySetInnerHTML={{__html: content}}>
    </div>
}