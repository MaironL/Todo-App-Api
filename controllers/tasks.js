const Task = require('../models/Task');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json(task);
};

const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
};

const getTask = async (req, res) => {
  const { userId } = req.user;
  const { id: taskId } = req.params;
  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json(task);
};

const updateTask = async (req, res) => {
  const { userId } = req.user;
  const { id: taskId } = req.params;
  const { task: updatedTask } = req.body;

  if (!updatedTask) {
    throw new BadRequestError('Task is required');
  }

  const task = await Task.findOneAndUpdate({ _id: taskId, createdBy: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw new NotFoundError(`No task found with id ${taskId}`);
  }
  res.status(StatusCodes.OK).json(task);
};

const deleteTask = async (req, res) => {
  const { userId } = req.user;
  const { id: taskId } = req.params;

  const task = await Task.findOneAndRemove({
    _id: taskId,
    createdBy: userId,
  });

  if (!task) {
    throw new NotFoundError(`No job with the id: ${taskId}`);
  }

  res.status(StatusCodes.OK).send();
};

const deleteCompleted = async (req, res) => {
  const { userId } = req.user;
  const tasks = await Task.deleteMany({ createdBy: userId, isCheck: true });

  if (!tasks) {
    throw new NotFoundError('No tasks found');
  }

  res.status(StatusCodes.OK).send();
};

module.exports = { createTask, getAllTasks, getTask, updateTask, deleteTask, deleteCompleted };
