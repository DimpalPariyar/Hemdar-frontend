const buildToQuery = (res, query) => {
    if(!res.locals.query){
        return query;
    }else{
        return { $and: [res.locals.query, query] };
    }
}

module.exports = {
    buildToQuery
}