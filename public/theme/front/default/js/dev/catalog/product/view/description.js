const Description = ({description, areaProps}) => {
    React.useEffect(()=>{
        areaProps.registerTab({name: "Description", id: "description"});
    }, []);

    return areaProps.currentTab == "description" ? <div className={"product-description"} dangerouslySetInnerHTML={{__html: description}}></div> : (null);
};

export default Description;