import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    problem:{
        type: String,
        required: true,
    },
    difficulty:{
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    //video call id which need to join for video call
    callId : {
        type: String,
        default: '',
    }
}, { timestamps: true });

export const Session =  mongoose.model('Session', SessionSchema);