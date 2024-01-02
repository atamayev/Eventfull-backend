import _ from "lodash"
import AwsSnsService from "../../../classes/aws-sns-service"

export default async function updateArn (user: User, notificationToken: string, primaryDevicePlatform: DevicePlatforms): Promise<void> {
	try {
		const newEndPointArn = await AwsSnsService.getInstance().createPlatformEndpoint(notificationToken, primaryDevicePlatform)

		if (_.isUndefined(newEndPointArn)) throw new Error("Unable to create new endpoint")

		if (primaryDevicePlatform === "ios") {
			user.iosEndpointArn = newEndPointArn
		} else if (primaryDevicePlatform === "android") {
			user.androidEndpointArn = newEndPointArn
		}
		user.notificationToken = notificationToken

		await user.save()
	} catch (error) {
		console.error("Error updating platform endpoint:", error)
		throw error
	}
}
