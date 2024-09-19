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
    },
    link: {
        type: String,
        required: false // Set to true if you want it to be a required field
    }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;