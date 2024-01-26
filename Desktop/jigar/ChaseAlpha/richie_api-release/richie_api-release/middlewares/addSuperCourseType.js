module.exports = (courseType) => {
    return async (req, res, next) => {
        res.locals = req.body
        res.locals["superCourseType"] = courseType
        next()
    }
}