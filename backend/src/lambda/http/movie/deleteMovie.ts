import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getUserId } from '../../utils'
import { deleteMovie } from '../../../businessLogic/movie'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('deleteMovie')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Start Handling deleteMovie Event', event)

  try {
    const userId = getUserId(event)
    const movieId = event.pathParameters.movieId

    await deleteMovie(userId, movieId)

    logger.info('End Handling deleteMovie Event Successfully.')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Movie deleted successfully.'
      })
    }
  } catch (e) {
    logger.error('End Handling deleteMovie Event With Errors.', {
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
