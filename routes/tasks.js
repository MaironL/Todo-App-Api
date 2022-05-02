const express = require('express');
const router = express.Router();
const appRoles = require('../constants/appRoles');
const userRoleAuthZMiddleware = require('../middleware/userRoleAuthZMW');

const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  deleteCompleted,
} = require('../controllers/tasks');

router
  .route('/')
  .post(
    userRoleAuthZMiddleware(appRoles.ADMIN, appRoles.EDITOR, appRoles.USER, appRoles.GUEST),
    createTask
  )
  .get(
    userRoleAuthZMiddleware(appRoles.ADMIN, appRoles.EDITOR, appRoles.USER, appRoles.GUEST),
    getAllTasks
  )
  .delete(
    userRoleAuthZMiddleware(appRoles.ADMIN, appRoles.EDITOR, appRoles.USER, appRoles.GUEST),
    deleteCompleted
  );

router
  .route('/:id')
  .get(
    userRoleAuthZMiddleware(appRoles.ADMIN, appRoles.EDITOR, appRoles.USER, appRoles.GUEST),
    getTask
  )
  .patch(
    userRoleAuthZMiddleware(appRoles.ADMIN, appRoles.EDITOR, appRoles.USER, appRoles.GUEST),
    updateTask
  )
  .delete(
    userRoleAuthZMiddleware(appRoles.ADMIN, appRoles.EDITOR, appRoles.USER, appRoles.GUEST),
    deleteTask
  );

module.exports = router;
