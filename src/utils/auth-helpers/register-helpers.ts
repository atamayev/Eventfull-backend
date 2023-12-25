import { Types } from "mongoose"
import UserModel from "../../models/user-model"
import Hash from "../../setup-and-security/hash"

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
	contactType: EmailOrPhone,
	hashedPassword: string
): Promise<Types.ObjectId> {
	const { contact, firstName, lastName, username } = registerInformationObject

	const userFields: NewLocalUserFields = {
		firstName,
		lastName,
		username,
		password: hashedPassword,
		authMethod: "Local",
		primaryContactMethod: contactType,
	}

	if (contactType === "Email") {
		userFields.email = contact
		userFields.isEmailVerified = false
	} else {
		userFields.phoneNumber = contact
		userFields.isPhoneVerified = false
	}

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
