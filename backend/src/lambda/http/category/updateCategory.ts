import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { getUserId } from '../../utils'
import { CategoryRequest } from '../../../requests/CategoryRequest'
import { updateCategory } from '../../../businessLogic/category'

import { createLogger } from '../../../utils/logger'
const logger = createLogger('updateCategory')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Start Handling updateCategory Event', event)

  try {
    const userId = getUserId(event)
    const categoryId = event.pathParameters.categoryId
    const updatedCategory: CategoryRequest = JSON.parse(event.body)

    await updateCategory(userId, categoryId, updatedCategory)

    logger.info('End Handling updateCategory Event Successfully.')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Category updated successfully.'
      })
    }
  } catch (e) {
    logger.error('End Handling updateCategory Event With Errors.', {
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
