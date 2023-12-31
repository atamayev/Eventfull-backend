import _ from "lodash"
import AwsSnsService from "../../../classes/aws-sns-service"

export default async function updateArn (user: User, notificationToken: string, primaryDevicePlatform: DevicePlatforms): Promise<void> {
	try {
		const doesUserArnExist = doesArnExist(primaryDevicePlatform, user)

		const notificationTokenIsNew = checkIfNotificationTokenIsNew(primaryDevicePlatform, user, notificationToken)

		const isNewPrimaryDevicePlatform = user.primaryDevicePlatform !== primaryDevicePlatform

		if (doesUserArnExist === true && notificationTokenIsNew === false && isNewPrimaryDevicePlatform === false) return
		const userArn = getUserArn(primaryDevicePlatform, user)
		await AwsSnsService.getInstance().deletePlatformEndpoint(userArn)
		const newEndPointarn = await AwsSnsService.getInstance().createPlatformEndpoint(notificationToken, primaryDevicePlatform)

		if (_.isUndefined(newEndPointarn)) throw new Error("Unable to create new endpoint")

		if (primaryDevicePlatform === "ios") {
			user.iosEndpointArn = newEndPointarn
		} else if (primaryDevicePlatform === "android") {
			user.androidEndpointArn = newEndPointarn
		}

		await user.save()
	} catch (error) {
		console.error("Error updating platform endpoint:", error)
		throw error
	}
}

function getUserArn(primaryDevicePlatform: DevicePlatforms, user: User): string | undefined {
	if (primaryDevicePlatform === "ios") {
		return user.iosEndpointArn
	} else if (primaryDevicePlatform === "android") {
		return user.androidEndpointArn
	} else {
		throw new Error(`Platform ${primaryDevicePlatform} is not supported`)
	}
}

function doesArnExist(primaryDevicePlatform: DevicePlatforms, user: User): boolean {
	if (primaryDevicePlatform === "ios") {
		return !_.isUndefined(user.iosEndpointArn)
	} else if (primaryDevicePlatform === "android") {
		return !_.isUndefined(user.androidEndpointArn)
	} else {
		throw new Error(`Platform ${primaryDevicePlatform} is not supported`)
	}
}

function checkIfNotificationTokenIsNew(primaryDevicePlatform: DevicePlatforms, user: User, notificationToken: string): boolean {
	if (primaryDevicePlatform === "ios") {
		return user.iosEndpointArn !== notificationToken
	} else if (primaryDevicePlatform === "android") {
		return user.androidEndpointArn !== notificationToken
	} else {
		throw new Error(`Platform ${primaryDevicePlatform} is not supported`)
	}
}
