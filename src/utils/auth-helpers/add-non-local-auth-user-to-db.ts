import AwsSnsService from "../../classes/aws-sns-service"
import UserModel from "../../models/user-model"

// eslint-disable-next-line max-params
export default async function addNonLocalUserToDB(
	email: string,
	firstName: string,
	lastName: string,
	authMethod: CloudAuthSources,
	primaryDevicePlatform: DevicePlatforms,
	notificationToken: string,
): Promise<User> {
	const endpointArn = await AwsSnsService.getInstance().createPlatformEndpoint(notificationToken, primaryDevicePlatform)

	const userFields: NewCloudUserFields = {
		email,
		firstName,
		lastName,
		authMethod,
		primaryContactMethod: "Email",
		isEmailVerified: true,
		primaryDevicePlatform,
		notificationToken,
	}

	if (primaryDevicePlatform === "ios") {
		userFields.iosEndpointArn = endpointArn
	} else if (primaryDevicePlatform === "android") {
		userFields.androidEndpointArn = endpointArn
	} else {
		throw new Error(`Platform ${primaryDevicePlatform} is not supported`)
	}

	const newUser = await UserModel.create(userFields)

	return newUser
}
