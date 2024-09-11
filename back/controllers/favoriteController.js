import asyncHandler from 'express-async-handler';

//automatically catching exceptions in asynchronous functions, 
//eliminating the need for manual try/catch blocks, and 
//facilitating the use of async/await in route handlers 
//without the risk of unhandled errors.

// @desc  GET favorites
// @route GET /api/favorites
// @access Private
const getFavorites = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Get Favorites'});
});

// @desc  Set favorite
// @route POST /api/favorite
// @access Private
const setFavorite = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    res.status(200).json({ message: 'Set Favorite'})
});

// @desc  Update favorite
// @route PUT /api/favorites/:id
// @access Private
const updateFavorite = asyncHandler(async (req,res) => {
    res.status(200).json({message: `Update favorite ${req.params.id}`})
});

// @desc  Delete favorite
// @route DELETE /api/favorites/:id
// @access Private
const deleteFavorite = asyncHandler(async (req,res) => {
    res.status(200).json({message: `Delete favorite ${req.params.id}`})
});

export { getFavorites, setFavorite, updateFavorite, deleteFavorite };