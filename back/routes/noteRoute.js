import express from 'express';
const router = express.Router()
import {
  getNotes,
  setNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';

router.route('/').get(getNotes).post(setNote);
router.route('/:id').delete(deleteNote).put(updateNote);

export default router;