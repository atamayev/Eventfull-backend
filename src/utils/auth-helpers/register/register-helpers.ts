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

export async function addLocalUser(
	registerInformationObject: RegisterInformationObject,
	hashedPassword: string,
	endpointArn: string
): Promise<Types.ObjectId> {
	const { contact, firstName, lastName, username, contactType,
		primaryDevicePlatform, notificationToken } = registerInformationObject

	const userFields: NewLocalUserFields = {
		firstName,
		lastName,
		username,
		password: hashedPassword,
		authMethod: "Local",
		primaryContactMethod: contactType,
		notificationToken,
		primaryDevicePlatform,
	}

	if (contactType === "Email") {
		userFields.email = contact
		userFields.isEmailVerified = false
	} else {
		userFields.phoneNumber = contact
		userFields.isPhoneVerified = false
	}

	if (primaryDevicePlatform === "android") {
		userFields.androidEndpointArn = endpointArn
	} else if (primaryDevicePlatform === "ios") {
		userFields.iosEndpointArn = endpointArn
	} else {
		throw new Error(`Platform ${primaryDevicePlatform} is not supported`)
	}

	const newUser = await UserModel.create(userFields)
	return newUser._id
}

export async function addCloudUserPersonalData(
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
