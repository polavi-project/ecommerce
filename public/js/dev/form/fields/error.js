let Error = (props)=> {
    let {error} = props;
    if(!error)
        return "";
    else
        return (<div className="error"><span>{error}</span></div>);
};

export {Error}