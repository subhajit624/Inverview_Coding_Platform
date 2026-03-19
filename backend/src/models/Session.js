import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    problem:{
        type: String,
        required: true,
    },
    difficulty:{
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
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
    //stream video call id
    callId : {
        type: String,
        default: '',
    }
}, { timestamps: true });

export const Session =  mongoose.model('Session', SessionSchema);