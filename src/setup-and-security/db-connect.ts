import _ from "lodash"
import mongoose from "mongoose"

export default async function connectDatabase(): Promise<void> {
	try {
		let connection: typeof mongoose | undefined
		if (_.isUndefined(connection)) {
			connection = await mongoose.connect(process.env.MONGODB_URI)
			console.info("Connected to MongoDB")
		}
	} catch (error) {
		console.error("Error connecting to MongoDB: ", error)
	}
}
