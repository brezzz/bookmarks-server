const express = require('express')
const uuid = require('uuid/v4');
const logger = require('../../logger')

const bookmarkRouter = express.Router()
const bodyParser = express.json()


const bookmarks = [{
  id: 1,
  description:"website 1"
}
,
{
  id: 2,
  description:"website 2"
}
]


bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
    .json(bookmarks)  

  })
  .post(bodyParser,(req, res) => {
      
    
    const {description} = req.body;
        
    if (!description) {
      logger.error(`Description must be entered`);
      return res
        .status(400)
        .send('Invalid data');
    }
    
  const id = uuid();
  
  const bookmark = {
    id,
    description
  };
  
  bookmarks.push(bookmark);
  
  logger.info(`Bookmark with id ${id} created`);
  
  res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${id}`)
    .json(bookmark);
  
  })


  bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
      
    const { id } = req.params;
    const bookmark = bookmarks.find(bm => bm.id == id);
    
    // Verifys id of bookmark
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    
    res.json(bookmark);
  })
  .delete((req, res) => {
      
    const { id } = req.params;
  
    const bmIndex = bookmarks.findIndex(bm => bm.id == id);
  
    if (bmIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }
  
    bookmarks.splice(bmIndex, 1);
  
    logger.info(`Bookmark with id ${id} deleted.`);
  
    res
      .status(204)
      .end();
  })


module.exports = bookmarkRouter