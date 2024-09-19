import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
});

const Group = mongoose.model('Group', groupSchema);

export default Group;