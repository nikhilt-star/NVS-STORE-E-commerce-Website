import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: [true, 'user is Required..!']
    },

    refreshTokenHash: {
        type: String,
        required: [true, 'Refresh Token is Required..!']
    },

    ip: {
        type: String,
        required: [true, 'IP is Required..!']
    },

    userAgent: {
        type: String,
        required: [true, 'Agent is Required..!']
    },

    revoke: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const sessionModel = mongoose.model('session',sessionSchema)

export default sessionModel
