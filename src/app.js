require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
const uuid = require('uuid/v4');
const { NODE_ENV } = require('./config')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json());


app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})




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

app.get('/hello', (req, res) => {
  res.send('Hello, boilerplate!')
})



const winston = require('winston');


// set up winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}


app.get('/bookmarks', (req, res) => {
  res
          .json(bookmarks)
})


app.get('/bookmarks/:id',(req, res) => {
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


app.post('/bookmarks', (req,res) => {
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

app.delete('/bookmarks/:id',(req, res) => {
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

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production')  {
      response = {error: {message: 'server error'}}
  } else {
      console.error(error)
      response = {message: error.message, error}
  }
res.status(500).json(reponse)}
)


module.exports = app
