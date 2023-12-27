import UserModel from "../../../models/user-model"

export default async function retrieveUserFromContact(contact: string, contactType: EmailOrPhoneOrUsername): Promise<User | null> {
	let user = null
	if (contactType === "Email") {
		user = await UserModel.findOne({
			email: { $regex: `^${contact}$`, $options: "i" },
		})
	} else if (contactType === "Phone") {
		user = await UserModel.findOne({
			phoneNumber: { $regex: `^${contact}$`, $options: "i" },
		})
	} else {
		user = await UserModel.findOne({
			username: { $regex: `^${contact}$`, $options: "i" },
		})
	}

	return user
}
