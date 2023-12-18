import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function updateUserAttendingStatus(
	userId: Types.ObjectId,
	eventfullEventId: string,
	eventIndex: number
): Promise<void> {
	if (eventIndex !== -1) {
		// Event found, update attendingStatus
		const updatePath = `eventfullEvents.${eventIndex}.attendingStatus`
		await UserModel.updateOne(
			{ _id: userId },
			{ $set: { [updatePath]: "Attending" } }
		)
	} else {
		// Event not found, add new eventfullEvent
		await UserModel.updateOne(
			{ _id: userId },
			{ $addToSet: {
				eventfullEvents: {
					eventId: eventfullEventId,
					attendingStatus: "Attending"
				}
			} }
		)
	}
}
