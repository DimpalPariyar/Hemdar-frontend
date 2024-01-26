const HostProfileModel = require("../model/hostProfile.model");

const hostProfileTypes = [
    {id: 0, label: "Advisor"},
    {id: 1, label: "Trainer"}
]

const getHostProfileTypes = async (req, res, _) => {
    res.status(200).send(hostProfileTypes)
}

const getAllHostProfiles = async (req, res, next) => {
    try {
        HostProfileModel.find({}).lean().exec(function (err, hostProfiles) {
            if (err) {
                next(err);
            }
            if (hostProfiles.length > 0) {
                hostProfiles.map((profile) => {
                    profile.type.map((type, index) => {
                        profile.type[index] = hostProfileTypes[type]
                    })
                })
            }
            return res.status(200).json(hostProfiles);
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const addHostProfile = async (req, res, next) => {
    try {
        const {
            hostName,
            profileImage,
            role,
            shortDescription,
            licenseNumber,
            email,
            address,
            registerNumber,
            phoneNumber,
            type
        } = req.body;

        const hostProfile = new HostProfileModel({
            hostName: hostName,
            profileImage: profileImage,
            role: role,
            shortDescription: shortDescription,
            licenseNumber: licenseNumber,
            email: email,
            address: address,
            registerNumber: registerNumber,
            phoneNumber: phoneNumber,
            type: type
        });

        hostProfile.save(function (e, result) {
            if (e) {
                return res.status(422).json({
                    success: false,
                    message: e.message
                });
            } else {
                return res.status(200).json({
                    success: true,
                    _id: result._id,
                    message: "New Host Profile is created successfully"
                });
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(422).json({
            success: false,
            message: e.message
        });
    }
};

const updateHostProfiles = async (req, res, next) => {
    try {
        const hostProfileId = req.params.hostProfileId;
        const {
            hostName, profileImage, role,
            shortDescription, licenseNumber, email,
            registerNumber, phoneNumber, type
        } = req.body;

        //check body contains atleast one data
        if (!hostName && !profileImage && !role &&
            !shortDescription && !licenseNumber && !email &&
            !registerNumber && !phoneNumber && !type) {
            return res.status(422).json({
                success: false,
                message: "Please add atleast one valid field in the request body"
            });
        }

        HostProfileModel.updateOne({_id: hostProfileId},
            {
                $set: {
                    hostName: hostName,
                    profileImage: profileImage,
                    role: role,
                    shortDescription: shortDescription,
                    licenseNumber: licenseNumber,
                    email: email,
                    registerNumber: registerNumber,
                    phoneNumber: phoneNumber,
                    type: type
                }
            }, {runValidators: true}, function (err) {
                if (err) {
                    return res.status(422).json({
                        message: err.message,
                    });
                } else {
                    return res.status(201).json({success: true, message: "Host Profile is updated sucessfully"});
                }
            });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const deleteHostProfile = async (req, res, next) => {
    try {
        const hostProfileId = req.params.hostProfileId;

        HostProfileModel.deleteOne({_id: hostProfileId}, function (err) {
            if (err) {
                return res.status(422).json({
                    message: err.message,
                });
            } else {
                return res.status(201).json({
                    success: true,
                    message: `HostProfile with hostProfileId: ${hostProfileId} is deleted successfully`
                });
            }
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

module.exports = {
    getHostProfileTypes,
    getAllHostProfiles,
    addHostProfile,
    updateHostProfiles,
    deleteHostProfile
}