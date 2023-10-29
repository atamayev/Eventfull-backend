import _ from "lodash"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

let connection: typeof mongoose | undefined

export default async function connectDatabase(): Promise<typeof mongoose | void> {
	try {
		if (_.isUndefined(connection)) {
			connection = await mongoose.connect(process.env.MONGODB_URI as string)
			console.log("Connected to MongoDB")
		}
		return connection
	} catch (error) {
		console.log("Error connecting to MongoDB: ", error)
	}
}
