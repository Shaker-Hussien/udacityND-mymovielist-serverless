import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { getUserId } from '../../utils'
import { UpdateMovieRequest } from '../../../requests/UpdateMovierequest'
import { updateMovie } from '../../../businessLogic/movie'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('updateMovie')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Start Handling updateMovie Event', event)

  try {
    const userId = getUserId(event)
    const movieId = event.pathParameters.movieId
    const updatedMovie: UpdateMovieRequest = JSON.parse(event.body)

    await updateMovie(userId, movieId, updatedMovie)

    logger.info('End Handling updateMovie Event Successfully.')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Movie Updated successfully.'
      })
    }
  } catch (e) {
    logger.error('End Handling updateMovie Event With Errors.', {
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
