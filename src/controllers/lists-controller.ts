import { Request, Response } from "express"
import OperationHandler from "../utils/operation-handler"
import EventCategoryModel from "../models/event-category-model"
import EventTypeModel from "../models/event-type-model"

export async function getEventCategories (req: Request, res: Response): Promise<void> {
	const operation = async () => {
		const response = await EventCategoryModel.find()
		return response
	}
	await OperationHandler.executeAsyncAndReturnValueToRes(res, operation, [])
}

export async function getEventTypes (req: Request, res: Response): Promise<void> {
	const operation = async () => {
		const response = await EventTypeModel.find()
		return response
	}
	await OperationHandler.executeAsyncAndReturnValueToRes(res, operation, [])
}
