import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { Category } from '../models/Category'
import { CategoryUpdate } from '../models/CategoryUpdate'

export class CategoryAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly categoriesTable = process.env.CATEGORIES_TABLE 
  ) 
  {}

  async getCategoriesForUser(userId: string): Promise<Category[]> {
    const params = {
      TableName: this.categoriesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }

    const result = await this.docClient.query(params).promise()

    return result.Items as Category[]
  }

  async getCategory(userId: string, categoryName: string): Promise<Category> {
    const params = {
      TableName: this.categoriesTable,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'categoryName = :categoryName',
      // ExpressionAttributeNames: {
      //   '#categoryName': 'name'
      // },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':categoryName': categoryName
      },
      ScanIndexForward: false
    }

    const result = await this.docClient.query(params).promise()
    console.log('Result Of: ',result)

    return result.Items[0] as Category
  }

  async createCategory(newCategory: Category): Promise<Category> {
    const params = {
      TableName: this.categoriesTable,
      Item: newCategory
    }
    await this.docClient.put(params).promise()

    return newCategory
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    updatedCategory: CategoryUpdate
  ): Promise<void> {
    const params = {
      TableName: this.categoriesTable,
      Key: {
        userId: userId,
        categoryId: categoryId
      },
      UpdateExpression:
        'set categoryName= :categoryName, categoryDescription= :categoryDescription',
      ExpressionAttributeValues: {
        ':categoryName': updatedCategory.name,
        ':categoryDescription': updatedCategory.description
      }
    }

    await this.docClient.update(params).promise()
  }

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const params = {
      TableName: this.categoriesTable,
      Key: {
        userId,
        categoryId
      }
    }

    await this.docClient.delete(params).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}