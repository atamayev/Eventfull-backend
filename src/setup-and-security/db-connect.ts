import _ from "lodash"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

let connection: typeof mongoose | undefined

export default async function connectDatabase(): Promise<typeof mongoose | void> {
	try {
		const mongoDBUri = process.env.MONGODB_URI as string

		if (_.isUndefined(connection)) {
			console.log("Connecting to MongoDB...")
			connection = await mongoose.connect(mongoDBUri)
		}
		return connection
	} catch (error) {
		console.log("Error connecting to MongoDB: ", error)
	}
}
