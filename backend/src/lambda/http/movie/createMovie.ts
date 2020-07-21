import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { getUserId } from '../../utils'
import { CreateMovieRequest } from '../../../requests/CreateMovieRequest'
import { createMovie } from '../../../businessLogic/movie'
import { getCategory } from '../../../businessLogic/category'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('createMovie')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Start Handling createMovie Event', event)

  try {
    const userId = getUserId(event)
    const newMovie: CreateMovieRequest = JSON.parse(event.body)
    const category = await getCategory(userId, newMovie.categoryName)
    if(!category){
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          message: 'Category Provided Not Found.'
        })
      }
    }
    const addedMovie = await createMovie(userId, category.categoryId ,newMovie)
    

    logger.info('End Handling createMovie Event Successfully.')

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        movie: addedMovie
      })
    }
  } catch (e) {
    logger.error('End Handling createMovie Event With Errors.', {
      Error: e.message
    })

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: e.message
      })
    }
  }
}
