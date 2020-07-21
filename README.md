# MyMovieList-Serverless

The Project idea is inspired by myanimelist.net. these are the apis required to track the movies you watched or planing to watch by adding these movies to your movieslist , categorizing them to custom categories (watched ,on hold etc) and rating them.

# Functionality of the application

This application will allow CRUD operations for Custom Categories and Movies. Each Movie can optionally have an attachment image. Each user only has access to Movies that he/she has created.

# Category

The application should be able to CRUD Custom Category Data (store/read/update/delete) like (eg Watched , Plan To Watch , Postponed, On Hold) in which the user categorized his/her list of movies :

* `categoryId` (string) - a unique id for category.
* `userId` (string) - id of an authorized user who is logged in.
* `categoryName` (string) - name of a the category.
* `categoryDescription` (string) - description for the custom category.

# Movie

The application should be able to CRUD Movie Data (store/read/update/delete) and Movie contains the following fields:

* `movieId` (string) - a unique id for movie.
* `userId` (string) - id of an authorized user who is logged in.
* `categoryId` (string) - id of the custome category for the movie and must be one from the categories you created.
* `movieName` (string) - name of a the movie.
* `movieDate` (string) - release date of the movie.
* `movieDescription` (string) - description for the movie.
* `movieRating` (number) (optional)- the rating you gave to the movie.
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to the movie.

# Functions implemented

* `Auth` - this function implements a custom authorizer for API Gateway that should be added to all other functions.

# For Custom Category

* `GetCategories` - should return all Custom Categories for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "categories": [
      {
        "categoryId": "category Id",
        "userId": "current user Id",
        "categoryName": "Watched",
        "categoryDescription": "this category includes allmovies I already watched."
      },
      {
        "categoryId":"category Id",
        "userId": "current user Id",
        "categoryName": "On Hold",
        "categoryDescription": ""
      }
  ]
}
```

* `CreateCategory` - should create a new Category for a current user. A shape of data send by a client application to this function can be found in the `CategoryRequest.ts` file

It receives a new Category to be created in JSON format that looks like this:

```json
{
	"name": "Watched",
	"description": "this category includes all movies I already watched."
}
```

It should return a new Category item that looks like this:

```json
{
  "category": {
      "userId": "current user Id",
      "categoryId": "Category Id",
      "categoryName": "Watched",
      "categoryDescription": "this category includesallmovies I already watched."
  }
}
```

* `UpdateCategory` - should update a Custom Category created by a current user. A shape of data send by a client application to this function can be found in the `CategoryRequest.ts` file ,  basically same as the created request shape but used to update the data for category.

The id of the category that should be updated is passed as a URL parameter.

It should return message containing either success or error details.

```json
{
    "message": "Category updated successfully."
}
```

* `DeleteCategory` - should delete a category created by a current user. Expects an id of a category item to remove.

It should return message containing either success or error details.

```json
{
    "message": "Category deleted successfully."
}
```

# For Movie

* `GetMovies` - should return all Movies for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "movies": [
      {
        "movieId": "Movie Id",
        "userId": "current user Id",
        "categoryId":"associated category Id",
        "movieName": "Naruto Shippuden the Movie: The Willof Fire",
        "movieDescription": "Anime",
        "movieDate": "August 1, 2009",
        "movieRating": 8,
        "attachmentUrl": "url for attachment", 
      },
      {
        "movieId": "Movie Id",
        "userId": "current user Id",
        "categoryId":"associated category Id",
        "movieName": "Naruto Shippuden the Movie: The LostTower",
        "movieDescription": "Anime",
        "movieDate": "August 2, 2008",
        "attachmentUrl": "url for attachment",   
      }
  ]
}
```

* `CreateMovie` - should Add a new Movie for a current user. A shape of data send by a client application to this function can be found in the `CreateMovieRequest.ts` file

It receives a new Movie to be created in JSON format that looks like this:

```json
{
  "name": "movieName",
  "description": "movieDescription",
  "date": "movieDate",
  "categoryName" : "categoryName"
}
```
**Note:** the category name must be matched with one of the created categories for the current user , if no match found the error message `Category Provided Not Found.` will be returned.

 It should return a new Movie item that looks like this:

```json
{
  "movie": {
      "userId": "current user Id",
      "movieId": "movie Id",
      "categoryId": "associated category Id",
      "movieName": "movieName",
      "movieDescription": "movieDescription",
      "movieDate": "movieDate"
  }
}
```

* `UpdateMovie` - should update a the movie data created by a current user. A shape of data send by a client application to this function can be found in the `UpdateMovierequest.ts` file ,  basically same as the created request shape but with rating gaven by user.

The id of the movie that should be updated is passed as a URL parameter.
```json
{
  "name": "movieName",
  "description": "movieDescription",
  "date": "movieDate",
  "rating" : 8
}
```

It should return message containing either success or error details.

```json
{
    "message": "Movie updated successfully."
}
```

* `DeleteMovie` - should delete a Movie created by a current user. Expects an id of a category item to remove.

It should return message containing either success or error details.

```json
{
    "message": "Movie deleted successfully."
}
```

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a movie.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```
# Postman collection
use the postman collection provided to test the apis.

**Note:** Collection variables needed are already initialized.

you can import postman collection following these steps:

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
