import UserModel from "../../models/user-model"

export default async function doesContactExist(contact: string, contactType: EmailOrPhone): Promise<boolean> {
	let exists: boolean
	if (contactType === "Email") exists = await doesEmailExist(contact)
	else exists = await doesPhoneExist(contact)

	return exists
}

async function doesEmailExist(email: string): Promise<boolean> {
	const user = await UserModel.findOne({
		email: { $regex: `^${email}$`, $options: "i" }
	})
	return user !== null
}

async function doesPhoneExist(phone: string): Promise<boolean> {
	const user = await UserModel.findOne({
		phone: { $regex: `^${phone}$`, $options: "i" }
	})
	return user !== null
}