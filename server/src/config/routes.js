import express from 'express';
import indexRouter from '../routes/index';
import usersRouter from '../routes/users';
import filesRouter from '../routes/files';

const router = express.Router();

router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/files', filesRouter);

module.exports = router;
