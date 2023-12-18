import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default async function addCohosts(
	userId: Types.ObjectId,
	eventfullEventId: string,
	currentEvent: EventfullEvent,
	updatedEventData: IncomingEventfullEvent
): Promise<void> {
	const user = await UserModel.findById(userId).select("friends")
	const friendIds = user?.friends.map(friend => friend.toString()) || []

	const updatedCoHostIds = updatedEventData.coHosts.map(coHost => coHost.toString())

	const coHostsToAdd = updatedEventData.coHosts
		.filter(hostId => friendIds.includes(hostId.toString()))
		.filter(hostId => !currentEvent.coHosts.some(existingCohost =>
			existingCohost.userId.toString() === hostId.toString()))
		.map(hostId => ({
			userId: hostId,
			invitedBy: userId
		}))

	const coHostsToRemove = currentEvent.coHosts.filter(existingCoHost =>
		!updatedCoHostIds.includes(existingCoHost.userId.toString())
	)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { coHosts, invitees, ...eventDataToUpdate } = updatedEventData

	if (!_.isEmpty(coHostsToRemove)) {
		const removeCoHostsPromise = EventfullEventModel.findByIdAndUpdate(
			eventfullEventId,
			{ $pull: { coHosts: { userId: { $in: coHostsToRemove.map(coHost => coHost.userId) } } } },
			{ new: true, runValidators: true }
		)
		const removeCoHostsPromises = coHostsToRemove.map(coHost =>
			UserModel.updateOne(
				{ _id: coHost.userId },
				{ $pull: { eventfullEvents: { eventId: eventfullEventId } } }
			)
		)
		await Promise.all([removeCoHostsPromise, ...removeCoHostsPromises])
	}

	if (!_.isEmpty(coHostsToAdd)) {
		const addCoHostsPromise = EventfullEventModel.findByIdAndUpdate(
			eventfullEventId,
			{
				$set: eventDataToUpdate,
				$push: { coHosts: { $each: coHostsToAdd } } },
			{ new: true, runValidators: true }
		)

		const addCoHostsPromises = coHostsToAdd.map(coHost =>
			UserModel.updateOne(
				{ _id: coHost.userId },
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

		await Promise.all([addCoHostsPromise, ...addCoHostsPromises])
	}
}
