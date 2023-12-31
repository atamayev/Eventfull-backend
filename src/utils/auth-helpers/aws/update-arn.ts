import _ from "lodash"
import AwsSnsService from "../../../classes/aws-sns-service"

export default async function updateArn (user: User, notificationToken: string, primaryDevicePlatform: DevicePlatforms): Promise<void> {
	try {
		const newEndPointarn = await AwsSnsService.getInstance().createPlatformEndpoint(notificationToken, primaryDevicePlatform)

		if (_.isUndefined(newEndPointarn)) throw new Error("Unable to create new endpoint")

		if (primaryDevicePlatform === "ios") {
			user.iosEndpointArn = newEndPointarn
		} else if (primaryDevicePlatform === "android") {
			user.androidEndpointArn = newEndPointarn
		}
		user.notificationToken = notificationToken

		await user.save()
	} catch (error) {
		console.error("Error updating platform endpoint:", error)
		throw error
	}
}

