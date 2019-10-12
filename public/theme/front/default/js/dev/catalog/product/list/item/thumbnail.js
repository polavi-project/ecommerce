const Thumbnail = ({imageUrl, alt}) => {
    return <div className="thumbnail">
        {imageUrl && <img src={imageUrl} alt={alt}/>}
        {!imageUrl && <span uk-icon="icon: image; ratio: 10"></span>}
    </div>
};
export {Thumbnail};