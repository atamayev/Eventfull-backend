import { Request, Response } from "express"
import OperationHandler from "../utils/operation-handler"
import { EventCategoryModel, EventTypeModel } from "../models/lists-models"

export async function fetchEventCategories (req: Request, res: Response): Promise<void> {
	const operation = async () => {
		const response = await EventCategoryModel.find()
		return response
	}
	await OperationHandler.executeAsyncAndReturnValueToRes(res, operation, [])
}

export async function fetchEventTypes (req: Request, res: Response): Promise<void> {
	const operation = async () => {
		const response = await EventTypeModel.find()
		return response
	}
	await OperationHandler.executeAsyncAndReturnValueToRes(res, operation, [])
}
