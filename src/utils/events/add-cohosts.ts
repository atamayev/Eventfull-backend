import _ from "lodash"
import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"
import UserModel from "../../models/user-model"

// eslint-disable-next-line max-lines-per-function
export default async function addCohosts(
	userId: Types.ObjectId,
	eventfullEventId: string,
	currentEvent: EventfullEvent,
	updatedEventData: IncomingEventfullEvent
): Promise<void> {
	const currentHostIds = currentEvent.coHosts.map(host => host.toString())
	const newHostIds = updatedEventData.coHosts.map(host => host.toString())
	const coHostsToAdd = newHostIds.filter(coHostId => !currentHostIds.includes(coHostId))
	const coHostsToRemove = currentHostIds.filter(existingCoHost => !newHostIds.includes(existingCoHost))

	if (!_.isEmpty(coHostsToRemove)) {
		await EventfullEventModel.findByIdAndUpdate(
			eventfullEventId,
			{ $pull: { coHosts: { $in: coHostsToRemove } } },
			{ new: true, runValidators: true }
		)
		const removeCoHostsPromises = coHostsToRemove.map(coHostId =>
			UserModel.updateOne(
				{ _id: coHostId },
				{ $pull: { eventfullEvents: { eventId: eventfullEventId } } }
			)
		)
		await Promise.all(removeCoHostsPromises)
	}

	if (!_.isEmpty(coHostsToAdd)) {
		await EventfullEventModel.findByIdAndUpdate(
			eventfullEventId,
			{ $addToSet: { coHosts: { $each: coHostsToAdd } } },
			{ new: true, runValidators: true }
		)

		const addCoHostsPromises = coHostsToAdd.map(coHostId =>
			UserModel.updateOne(
				{ _id: coHostId },
				{
					$push: {
						eventfullEvents: {
							eventId: eventfullEventId,
							attendingStatus: "Co-Hosting",
							invitedBy: userId
						}
					}
				})
		)

		await Promise.all(addCoHostsPromises)
	}
}
