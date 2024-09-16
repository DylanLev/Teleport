// models/eventModel.js
import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;