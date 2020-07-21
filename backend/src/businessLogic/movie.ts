import * as uuid from 'uuid'

import { Movie } from '../models/Movie'
import { MovieAccess } from '../dataLayer/movieAccess'
import { CreateMovieRequest } from '../requests/CreateMovieRequest'
import { UpdateMovieRequest } from '../requests/UpdateMovierequest'
import { createLogger } from '../utils/logger'

const movieAccess = new MovieAccess()
const logger = createLogger('MovieAccess')

export async function getMoviesForUser(userId: string): Promise<Movie[]> {
  logger.info(`Getting all Movies For User : ${userId}`)

  return movieAccess.getMoviesForUser(userId)
}

export async function createMovie(
  userId: string,
  categoryId: string,
  createMovieRequest: CreateMovieRequest
 
): Promise<Movie> {
  logger.info(`Adding new Movie For User : ${userId}`, {
    MovieRequest: createMovieRequest
  })

  return await movieAccess.createMovie({
    userId,
    movieId: uuid.v4(),
    categoryId: categoryId,
    movieName: createMovieRequest.name,
    movieDescription: createMovieRequest.description,
    movieDate: createMovieRequest.date
  })
}

export async function updateMovie(
  userId: string,
  movieId: string,
  updatedMovie: UpdateMovieRequest
): Promise<void> {
  logger.info(`Updating Movie For User : ${userId}`, {
    MovieId: movieId,
    MovieRequest: updatedMovie
  })

  await movieAccess.updateMovie(userId, movieId, updatedMovie)
}

export async function deleteMovie(
  userId: string,
  movieId: string
): Promise<void> {
  logger.info(`Deleting Movie For User : ${userId}`, { MovieId: movieId })

  await movieAccess.deleteMovie(userId, movieId)
}

export async function generateUploadURL(
  userId: string,
  movieId: string
): Promise<string> {
  logger.info(`Generating Upload URL For User : ${userId} and Movie : ${movieId}`)

  return await movieAccess.generateUploadURL(userId, movieId)
}
