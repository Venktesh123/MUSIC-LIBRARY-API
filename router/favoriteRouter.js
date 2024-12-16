const express = require("express");
const router = express.Router();
const {
  addFavorite,
  FavoriteByCategory,
  deleteFavorite,
} = require("../controller/favoriteController");

router.post("/favorites/add-favorite", addFavorite);
router.post("/favorites/:category", FavoriteByCategory);
router.delete("/favorites/remove-favorite/:id", deleteFavorite);
module.exports = router;
