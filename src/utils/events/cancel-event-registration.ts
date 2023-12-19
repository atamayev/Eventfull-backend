import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function cancelEventRegistration(
	userId: Types.ObjectId,
	eventfullEventId: Types.ObjectId,
	eventIndex: number
): Promise<void> {
	if (eventIndex !== -1) {
		// Event found, update attendingStatus
		const updatePath = `eventfullEvents.${eventIndex}.attendingStatus`
		await UserModel.findByIdAndUpdate(
			userId,
			{ $set: { [updatePath]: "Not Attending" } },
			{ runValidators: true }
		)
	} else {
		// Event not found, add new eventfullEvent
		await UserModel.findByIdAndUpdate(
			userId,
			{
				addToSet: {
					eventfullEvents: {
						eventId: eventfullEventId,
						attendingStatus: "Not Attending"
					}
				}
			},
			{ runValidators: true }
		)
	}
}
