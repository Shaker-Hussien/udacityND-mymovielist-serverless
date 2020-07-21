import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getUserId } from '../../utils'
import { getMoviesForUser } from '../../../businessLogic/movie'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('getMovies')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Start Handling getMovies Event', event)

  try {
    const userId = getUserId(event)
    const movies = await getMoviesForUser(userId)

    logger.info('End Handling getMovies Event Successfully.')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        movies
      })
    }
  } catch (e) {
    logger.error('End Handling getMovies Event With Errors.', {
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
