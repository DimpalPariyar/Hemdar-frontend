const ProgramSessionModel = require("../model/programSession.model");

const isProgramAndSessionExist = async (req, res, next) => {
    try {
        const {programId, sessionId} = req.params;

        let isSessionExist = await ProgramSessionModel.exists(
            {$and: [{programId: programId}, {sessionId: sessionId}]}
        );
        if (!isSessionExist) {
            return res.status(422).json({
                success: false,
                message: `No session found for programId: ${programId} and sessionId: ${sessionId}`
            });
        }

        next()
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const isProgramSessionExist = async (req, res, next) => {
    try {
        const {sessionId} = req.params;

        let isSessionExist = await ProgramSessionModel.exists({sessionId: sessionId});

        if (!isSessionExist) {
            return res.status(422).json({
                success: false,
                message: `No session found for sessionId: ${sessionId}`
            });
        }

        next()
    } catch (e) {
        console.log(e)
        next(e)
    }
};

module.exports = {
    isProgramSessionExist,
    isProgramAndSessionExist
}