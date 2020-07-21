export interface Movie {
  userId: string
  movieId: string
  categoryId: string
  movieName: string
  movieDescription: string
  movieDate: string
  movieRating?: number
  attachmentUrl?: string
}
