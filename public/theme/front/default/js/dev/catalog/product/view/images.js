function MainImage({src, alt}) {
    return <div className="product-image product-single-page-image">
        <img src={src} alt={alt}/>
    </div>
}

export default function Images({images, productName}) {
    const [mainImage, setMainImage] = React.useState(images.find(function(i) {
        return i.isMain === true;
    }));

    return <div className="product-single-media">
        {mainImage && <MainImage src={mainImage.main} alt={productName}/>}
        <ul className="more-view-thumbnail product-gallery">
            {images.map((i,j) => {
                return <li key={j}><a href={"#"} onClick={(e) => {e.preventDefault(); setMainImage({...i});}}><img src={i.thumb} alt={productName}/></a></li>
            })}
        </ul>
    </div>
}