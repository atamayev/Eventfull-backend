import _ from "lodash"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default async function addCohosts(
	user: User,
	currentEvent: EventfullEvent,
	updatedEventData: IncomingEventfullEvent
): Promise<void> {
	const friendIds = user.friends.map(friend => friend.toString())

	const updatedCoHostIds = updatedEventData.coHosts.map(coHost => coHost.toString())

	const coHostsToAdd = updatedEventData.coHosts
		.filter(hostId => friendIds.includes(hostId.toString()))
		.filter(hostId => !currentEvent.coHosts.some(existingCohost =>
			existingCohost.userId.toString() === hostId.toString()))
		.map(hostId => ({
			userId: hostId,
			invitedBy: user._id
		}))

	const coHostsToRemove = currentEvent.coHosts.filter(existingCoHost =>
		!updatedCoHostIds.includes(existingCoHost.userId.toString())
	)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { coHosts, invitees, ...eventDataToUpdate } = updatedEventData

	if (!_.isEmpty(coHostsToRemove)) {
		const removeCoHostsPromise = EventfullEventModel.findByIdAndUpdate(
			currentEvent._id,
			{ $pull: { coHosts: { userId: { $in: coHostsToRemove.map(coHost => coHost.userId) } } } },
			{ runValidators: true }
		)
		const removeCoHostsPromises = coHostsToRemove.map(coHost =>
			UserModel.findByIdAndUpdate(
				coHost.userId,
				{ $pull: { eventfullEvents: { eventId: currentEvent._id } } },
				{ runValidators: true }
			)
		)
		await Promise.all([removeCoHostsPromise, ...removeCoHostsPromises])
	}

	if (!_.isEmpty(coHostsToAdd)) {
		const addCoHostsPromise = EventfullEventModel.findByIdAndUpdate(
			currentEvent._id,
			{
				$set: eventDataToUpdate,
				$push: { coHosts: { $each: coHostsToAdd } } },
			{ runValidators: true }
		)

		const addCoHostsPromises = coHostsToAdd.map(coHost =>
			UserModel.findByIdAndUpdate(
				coHost.userId,
				{
					$push: {
						eventfullEvents: {
							eventId: currentEvent._id,
							attendingStatus: "Co-Hosting",
							invitedBy: user._id
						}
					}
				}, { runValidators: true }
			),
		)

		await Promise.all([addCoHostsPromise, ...addCoHostsPromises])
	}
}
