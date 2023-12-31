import { Types } from "mongoose"
import UserModel from "../../../models/user-model"
import Hash from "../../../classes/hash"

export async function hashPassword(password: string): Promise<{ hashedPassword: string, hashError?: string }> {
	try {
		const hashedPassword = await Hash.hashCredentials(password)
		return { hashedPassword }
	} catch (error) {
		console.error(error)
		return { hashedPassword: "", hashError: "Error hashing password" }
	}
}

// eslint-disable-next-line max-params
export async function addLocalUser(
	registerInformationObject: RegisterInformationObject,
	hashedPassword: string,
	primaryDevicePlatform: DevicePlatforms,
	notificationToken: string,
	endpointArn: string
): Promise<Types.ObjectId> {
	const { contact, firstName, lastName, username } = registerInformationObject

	const userFields: NewLocalUserFields = {
		firstName,
		lastName,
		username,
		password: hashedPassword,
		authMethod: "Local",
		primaryContactMethod: registerInformationObject.contactType,
		notificationToken,
	}

	if (registerInformationObject.contactType === "Email") {
		userFields.email = contact
		userFields.isEmailVerified = false
	} else {
		userFields.phoneNumber = contact
		userFields.isPhoneVerified = false
	}

	if (primaryDevicePlatform === "android") userFields.androidEndpointArn = endpointArn
	else if (primaryDevicePlatform === "ios") userFields.iosEndpointArn = endpointArn

	const newUser = await UserModel.create(userFields)
	return newUser._id
}

export async function addCloudUser(
	userId: Types.ObjectId,
	cloudUserRegisterInformationObject: CloudUserRegisterInformationObject
): Promise<void> {
	const { firstName, lastName, username } = cloudUserRegisterInformationObject

	await UserModel.findByIdAndUpdate(userId, {
		firstName,
		lastName,
		username,
	},
	{ runValidators: true })
}
