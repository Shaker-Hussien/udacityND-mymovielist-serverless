import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { Movie } from '../models/Movie'
import { MovieUpdate } from '../models/MovieUpdate'

export class MovieAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = createS3(),
    private readonly moviesTable = process.env.MOVIES_TABLE,
    private readonly movies_attchments_bucket = process.env.ATTACHMENTS_BUCKET,
    private readonly expiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async getMoviesForUser(userId: string): Promise<Movie[]> {
    const params = {
      TableName: this.moviesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }

    const result = await this.docClient.query(params).promise()

    return result.Items as Movie[]
  }

  async createMovie(newMovie: Movie): Promise<Movie> {
    const params = {
      TableName: this.moviesTable,
      Item: newMovie
    }
    await this.docClient.put(params).promise()

    return newMovie
  }

  async updateMovie(
    userId: string,
    movieId: string,
    updatedMovie: MovieUpdate
  ): Promise<void> {
    const params = {
      TableName: this.moviesTable,
      Key: {
        userId: userId,
        movieId: movieId
      },
      UpdateExpression:
        'set movieName= :movieName, movieDescription= :movieDescription, movieDate= :movieDate, movieRating= :movieRating',
      ExpressionAttributeValues: {
        ':movieName': updatedMovie.name,
        ':movieDescription': updatedMovie.description,
        ':movieDate': updatedMovie.date,
        ':movieRating': updatedMovie.rating
      }
    }

    await this.docClient.update(params).promise()
  }

  async deleteMovie(userId: string, movieId: string): Promise<void> {
    const params = {
      TableName: this.moviesTable,
      Key: {
        userId,
        movieId
      }
    }

    await this.docClient.delete(params).promise()
  }

  async generateUploadURL(userId: string, movieId: string): Promise<string> {
    const attachmentUrl = `https://${this.movies_attchments_bucket}.s3.amazonaws.com/${movieId}`

    const params = {
      TableName: this.moviesTable,
      Key: {
        userId,
        movieId
      },
      UpdateExpression: 'set attachmentUrl= :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
      // ReturnValues: 'UPDATED_NEW'
    }

    await this.docClient.update(params).promise()
    
    //return signed url
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.movies_attchments_bucket,
      Key: movieId,
      Expires: this.expiration
    })
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

function createS3() {
  return new XAWS.S3({
    signatureVersion: 'v4'
  })
}
