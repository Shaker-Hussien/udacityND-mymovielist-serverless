import * as uuid from 'uuid'

import { Category } from '../models/Category'
import { CategoryAccess } from '../dataLayer/categoryAccess'
import { CategoryRequest } from '../requests/CategoryRequest'
import { createLogger } from '../utils/logger'

const categoryAccess = new CategoryAccess()
const logger = createLogger('CategoryAccess')

export async function getCategoriesForUser(
  userId: string
): Promise<Category[]> {
  logger.info(`Getting all Categories For User : ${userId}`)

  return categoryAccess.getCategoriesForUser(userId)
}

export async function getCategory(
  userId: string,
  categoryName: string
): Promise<Category> {
  logger.info(`Getting Category Info For User : ${userId}`,{CategoryName: categoryName})

  return categoryAccess.getCategory(userId, categoryName)
}

export async function createCategory(
  userId: string,
  createCategoryRequest: CategoryRequest
): Promise<Category> {
  logger.info(`Adding new Category For User : ${userId}`, {
    CategoryRequest: createCategoryRequest
  })

  return await categoryAccess.createCategory({
    userId,
    categoryId: uuid.v4(),
    categoryName: createCategoryRequest.name,
    categoryDescription: createCategoryRequest.description
  })
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  updatedCategory: CategoryRequest
): Promise<void> {
  logger.info(`Updating Category For User : ${userId}`, {
    CategoryId: categoryId,
    UpdateCategoryRequest: updatedCategory
  })

  await categoryAccess.updateCategory(userId, categoryId, updatedCategory)
}

export async function deleteCategory(
  userId: string,
  categoryId: string
): Promise<void> {
  logger.info(`Deleting Category For User : ${userId}`, { CategoryId: categoryId })

  await categoryAccess.deleteCategory(userId, categoryId)
}
