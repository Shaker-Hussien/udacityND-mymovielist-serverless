import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { getUserId } from '../../utils'
import { CategoryRequest } from '../../../requests/CategoryRequest'
import { createCategory } from '../../../businessLogic/category'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('createCategory')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Start Handling createCategory Event', event)

  try {
    const userId = getUserId(event)
    const newCategory: CategoryRequest = JSON.parse(event.body)
    const addedCategory = await createCategory(userId, newCategory)

    logger.info('End Handling createCategory Event Successfully.')

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        category: addedCategory
      })
    }
  } catch (e) {
    logger.error('End Handling createCategory Event With Errors.', {
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
