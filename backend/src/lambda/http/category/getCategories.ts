import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getUserId } from '../../utils'
import { getCategoriesForUser } from '../../../businessLogic/category'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('getCategories')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Start Handling getCategories Event', event)

  try {
    const userId = getUserId(event)
    const categories = await getCategoriesForUser(userId)

    logger.info('End Handling getCategories Event Successfully.')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        categories
      })
    }
  } catch (e) {
    logger.error('End Handling getCategories Event With Errors.', {
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
