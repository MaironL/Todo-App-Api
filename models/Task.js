const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      trim: true,
      required: [true, 'Please provide a task'],
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TasksSchema);
