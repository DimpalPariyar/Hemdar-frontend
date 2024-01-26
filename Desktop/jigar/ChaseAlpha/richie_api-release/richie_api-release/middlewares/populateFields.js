module.exports = (fieldsToPopulate) => {
    return async (req, res, next) => {
        res.locals.fieldsToPopulate = fieldsToPopulate
        next()
    }
}