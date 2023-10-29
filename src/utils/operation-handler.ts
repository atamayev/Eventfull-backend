/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"

export default new class OperationHandler {
	// Use this function when you want to execute an async operation and return a custom value to the client
	async executeAsyncOperationAndReturnCustomValueToRes(
		res: Response,
		operation: () => Promise<any>,
		whatToReturnSuccess: any = null
	): Promise<void | Response> {
		try {
			await operation()
			res.status(200).json(whatToReturnSuccess)
		} catch (error: any) {
			console.log(error)
			return res.status(400).json()
		}
	}

	// Use this function when you want to execute an async operation without a custom value to the client
	async executeAsyncOperationWithoutReturnValueNorRes(
		res: Response,
		operation: () => Promise<any>,
		whatToReturnFailure: string[] | null = null
	): Promise<void | Response> {
		try {
			await operation()
		} catch (error: any) {
			console.log(error)
			return res.status(400).json(whatToReturnFailure)
		}
	}

	// Use this function when you want to execute an async operation and return the value of the operation to the client
	async executeAsyncAndReturnValueToRes(
		res: Response,
		operation: () => Promise<any>,
		whatToReturnFailure: string[] | null = null
	): Promise<void | Response> {
		try {
			const result = await operation()
			res.status(200).json(result)
		} catch (error: any) {
			console.log(error)
			return res.status(400).json(whatToReturnFailure)
		}
	}

	// Use this function when you want to execute an async operation and return the value of the operation.
	// This function does not return a value to the client
	// This function accepts arbitrary number of arguments
	async executeAsyncAndReturnValue<T>(
		res: Response,
		fn: (...args: any[]) => Promise<T>,
		...args: any[]
	): Promise<T | void | Response> {
		try {
			return await fn(...args)
		} catch (error: any) {
			console.log(error)
			return res.status(400).json()
		}
	}
}()
