import express from 'express';
const router = express.Router()
import {
  getFavorites,
  setFavorite,
  updateFavorite,
  deleteFavorite,
} from '../controllers/favoriteController.js';


router.route('/').get(getFavorites).post(setFavorite);
router.route('/:id').delete(deleteFavorite).put(updateFavorite);

export default router;