import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getUserId } from '../../utils'
import { deleteCategory } from '../../../businessLogic/category'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('deleteCategory')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Start Handling deleteCategory Event', event)

  try {
    const userId = getUserId(event)
    const categoryId = event.pathParameters.categoryId

    await deleteCategory(userId, categoryId)

    logger.info('End Handling deleteCategory Event Successfully.')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Category deleted successfully.'
      })
    }
  } catch (e) {
    logger.error('End Handling deleteCategory Event With Errors.', {
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
