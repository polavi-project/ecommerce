function MainImage({src, alt}) {
    return <div className="product-image">
        <img src={src} alt={alt}/>
    </div>
}

export default function Images({images, productName}) {
    let mainImage = images.find(function(i) {
        return i.isMain === true;
    });
    return <div className="uk-width-1-2">
        {mainImage && <MainImage src={mainImage.main} alt={productName}/>}
        <ul className="uk-thumbnav product-gallery">
            {images.map((i,j) => {
                return <li key={j}><a href={"#"}><img src={i.thumb} alt={productName}/></a></li>
            })}
        </ul>
    </div>
}