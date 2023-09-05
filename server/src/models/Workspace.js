import mongoose from 'mongoose';
import Schema from '../utils/schema-builder';

const schemaDef = Schema({
  name: { type: String, required: true },
  identifier: { type: String, required: true, unique: true, index: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Workspace', schemaDef);
