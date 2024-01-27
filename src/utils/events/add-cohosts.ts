import _ from "lodash"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default async function addCohosts(
	user: User,
	currentEvent: EventfullEvent,
	updatedEventData: IncomingEventfullEvent,
	createdAt: Date
): Promise<void> {
	const friendIds = user.friends.map(friend => friend.userId.toString())

	const updatedCoHostIds = updatedEventData.coHosts.map(coHost => coHost.userId.toString())

	const coHostsToAdd: EventfullCoHost[] = updatedEventData.coHosts
		.filter(host => friendIds.includes(host.userId.toString()))
		.filter(host => !currentEvent.coHosts.some(existingCohost =>
			existingCohost.user.userId.toString() === host.userId.toString()))
		.map(host => ({
			user: {
				userId: host.userId,
				username: host.username,
			},
			invitedBy: {
				userId: user._id,
				username: user.username || "User",
				createdAt,
			}
		}))

	const coHostsToRemove = currentEvent.coHosts.filter(existingCoHost =>
		!updatedCoHostIds.includes(existingCoHost.user.userId.toString())
	)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { coHosts, invitees, ...eventDataToUpdate } = updatedEventData

	if (!_.isEmpty(coHostsToRemove)) {
		const removeCoHostsPromise = EventfullEventModel.findByIdAndUpdate(
			currentEvent._id,
			{ $pull: { coHosts: { userId: { $in: coHostsToRemove.map(coHost => coHost.user.userId) } } } },
			{ runValidators: true }
		)
		const removeCoHostsPromises = coHostsToRemove.map(coHost =>
			UserModel.findByIdAndUpdate(
				coHost.user.userId,
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
				coHost.user.userId,
				{
					$push: {
						eventfullEvents: {
							eventId: currentEvent._id,
							attendingStatus: "Co-Hosting",
							invitedBy: {
								userId: user._id,
								username: user.username,
							}
						}
					}
				}, { runValidators: true }
			),
		)

		await Promise.all([addCoHostsPromise, ...addCoHostsPromises])
	}
}
