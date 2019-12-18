require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bookmarkRouter = require('./bookmarks/bookmark-router')

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

const bookmarks = [
  {
  id: 1,
  description:"website 1"}
,
{id: 2,
 description:"website 2"}]

app.get('/hello', (req, res) => {
  res.send('Hello, boilerplate!')
})


app.use(bookmarkRouter)


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
