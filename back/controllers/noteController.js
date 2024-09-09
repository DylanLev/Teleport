const asyncHandler = require('express-async-handler');
//automatically catching exceptions in asynchronous functions, 
//eliminating the need for manual try/catch blocks, and 
//facilitating the use of async/await in route handlers 
//without the risk of unhandled errors.

// @desc  GET Notes
// @route GET /api/notes
// @access Private
const getNotes = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Get Notes'});
});

// @desc  Set Note
// @route POST /api/note
// @access Private
const setNote = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    res.status(200).json({ message: 'Set Note'})
});

// @desc  Update Note
// @route PUT /api/notes/:id
// @access Private
const updateNote = asyncHandler(async (req,res) => {
    res.status(200).json({message: `Update Note ${req.params.id}`})
});

// @desc  Delete Note
// @route DELETE /api/notes/:id
// @access Private
const deleteNote = asyncHandler(async (req,res) => {
    res.status(200).json({message: `Delete Note ${req.params.id}`})
});

module.exports = {
    getNotes,
    setNote,
    updateNote,
    deleteNote
}