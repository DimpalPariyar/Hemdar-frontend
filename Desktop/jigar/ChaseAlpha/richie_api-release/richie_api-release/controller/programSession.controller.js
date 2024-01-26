const ProgramSessionModel = require("../model/programSession.model");
const SessionBroadcast = require("../model/sessionBroadcast.model");
const SessionQuestions = require("../model/sessionQuestion.model");
const {emitDataToSocket} = require("../service/socket_io_service");
const {getMeetingLink} = require("../service/zoom_meeting");
const moment = require('moment');

const getProgramSessions = async (req, res, next) => {
    try {
        const programId = req.params.programId;
        ProgramSessionModel.find({programId: programId}).populate('hostDetails', "-_id -type -licenseNumber -registerNumber").lean().  //TODO:Display only future dates
            exec(function (err, sessions) {
                if (err) return next(err);
                return res.status(200).json({success: true, data: sessions});
            });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const createProgramSession = async (req, res, next) => {
    try {
        let {
            title, dates, sessionLink, description, shortDescription, longDescription,
            deActivated, basePricePerSession, disclaimer, hostProfileIds, bannerImage,
            closeSessionAfter
        } = req.body;

        let sessionName_with_index = [];

        if (!dates) {
            return res.status(422).json({
                success: false,
                message: "Please provide information for all required fields"
            });
        }

        let getStartIndex = 1;
        const count = await ProgramSessionModel.countDocuments();
        if (count > 0) {
            getStartIndex = count + 1
        }
        // index the session prefix
        for (let i = 0; i < dates.length; i++) {
            sessionName_with_index.push(`${title} ${getStartIndex}`)
            getStartIndex++;
        }

        const savePromises = [];
        const format = "YYYY-MM-DDTHH:mm:ssZ";
        for (let i = 0; i < dates.length; i++) {
            const zoomLink = await getMeetingLink({
                name : sessionName_with_index[i],
                dateTime : moment(dates[i]).format(format)
            })        
            const session = new ProgramSessionModel({
                date: dates[i],
                sessionName: sessionName_with_index[i],
                shortDescription: shortDescription,
                longDescription: longDescription,
                sessionLink: zoomLink.link || sessionLink,
                webinarId:zoomLink.id,
                hostIds: hostProfileIds,
                description: description,
                closeSessionAfter: closeSessionAfter,
                bannerImage: bannerImage,
                basePricePerSession: basePricePerSession,
                deActivated: deActivated,
                disclaimer: disclaimer
            });
            savePromises.push(session.save());
        }
        await Promise.all(savePromises);
        return res.status(200).json({
            success: true,
            message: `Created ${dates.length} Sessions`
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const updateprogramSession = async (req, res, next) => {
    try {
        const {programId, sessionId} = req.params;

        let {
            date, sessionLink, description, sessionName,
            deActivated, basePricePerSession, disclaimer, bannerImage, hostProfileIds
        } = req.body;

        //check for all fields
        if (req.length === 0 || (!hostProfileIds && !date && !sessionLink && !sessionName && !description && !basePricePerSession && !disclaimer && !deActivated && !bannerImage)) {
            return res.status(422).json({
                success: false,
                message: "Please provide atleast one allowable field of session"
            });
        }
        ProgramSessionModel.updateOne({$and: [{programId: programId}, {sessionId: sessionId}]},
            {
                $set: {
                    date: date,
                    sessionName: sessionName,
                    sessionLink: sessionLink,
                    description: description,
                    hostIds: hostProfileIds,
                    basePricePerSession: basePricePerSession,
                    deActivated: deActivated,
                    bannerImage: bannerImage,
                    disclaimer: disclaimer
                }
            }, function (err) {
                if (err) {
                    return res.status(422).json({
                        message: err.message,
                    });
                } else {
                    return res.status(201).json({success: true, message: "Session data is updated sucessfully"});
                }
            });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const getAllSessionByMonth = async (req, res, next) => {
    try {
        const {month, year} = req.params;
        const query = res.locals.query || {};
        ProgramSessionModel.find({
            $and: [
                {
                    date: {
                        "$gte": new Date(year, month - 1, 1),
                        "$lt": new Date(year, month, 1)
                    }
                },
                query
            ]
        }).lean().exec(function (err, sessions) {
            if (err) return next(err);
            return res.status(200).json(sessions);
        });

    } catch (e) {
        console.log(e)
        next(e)
    }
};

const getAllSessionByMonthForProgram = async (req, res, next) => {
    try {
        const {programId, month, year} = req.params;
        ProgramSessionModel.find({
            $and: [
                {programId: programId},
                {
                    date: {
                        "$gte": new Date(year, month - 1, 1),
                        "$lt": new Date(year, month, 1)
                    }
                }
            ]
        }).lean().exec(function (err, sessions) {
            if (err) return next(err);
            return res.status(200).json({success: true, data: sessions});
        });

    } catch (e) {
        console.log(e)
        next(e)
    }
};

const deleteProgramSession = async (req, res, next) => {
    try {
        const {sessionId} = req.params;

        ProgramSessionModel.deleteOne(
            {sessionId: sessionId},
            function (err) {
                if (err) {
                    return res.status(422).json({
                        message: err.message,
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Program session is deleted sucessfully"
                });
            });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const addAnswer = async (req, res, next) => {
    const { questionId, answer } = req.body;
    const question = await SessionQuestions.findById(questionId);
    question.answer = answer
    await question.save();
    res.send(question);
}
const addReaction = async (req, res, next) => {
    const { broadcastId, emoji } = req.body;
    const userId = res.locals.user._id

    const broadcast = await SessionBroadcast.findById(broadcastId);
    const existingReaction = broadcast.reactions.find(reaction => reaction.userId.toString() === userId.toString());

    if (existingReaction) {
        broadcast.reactions = broadcast.reactions.filter(reaction => reaction.userId.toString() !== userId.toString());
    }

    broadcast.reactions.push({ emoji, userId });
    await broadcast.save();
    res.send(broadcast);
};

const deleteReaction = async (req, res, next) => {
    const { broadcastId } = req.body;
    const userId = res.locals.user._id

    const broadcast = await SessionBroadcast.findById(broadcastId);
    broadcast.reactions = broadcast.reactions.filter(reaction => reaction.userId.toString() !== userId.toString());
    await broadcast.save();
    emitDataToSocket("SESSION_QB",broadcast)

    res.send(broadcast);
};

module.exports = {
    getProgramSessions,
    createProgramSession,
    updateprogramSession,
    deleteProgramSession,
    getAllSessionByMonthForProgram,
    getAllSessionByMonth,
    addReaction,
    deleteReaction,
    addAnswer
}