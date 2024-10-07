import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: false
  },
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;