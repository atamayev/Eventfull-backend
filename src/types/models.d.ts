import { Document, Types } from "mongoose"

declare global {
	interface IDInterface extends Document {
		_id: Types.ObjectId
	}
	interface EventCategory extends IDInterface {
		eventCategory: string
		description: string
	}
	interface EventType extends IDInterface {
		name: string
		description: string
		// Categories should be of type eventCategory[]
		categories: string[]
	}
}

export {}
