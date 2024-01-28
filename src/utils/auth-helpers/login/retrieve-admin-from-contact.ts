import AdminModel from "../../../models/admin-model"

export default async function retrieveAdminFromContact(contact: string, contactType: EmailOrUsername): Promise<Admin | null> {
	let admin = null
	if (contactType === "Email") {
		admin = await AdminModel.findOne({
			email: { $regex: `^${contact}$`, $options: "i" },
		})
	} else {
		admin = await AdminModel.findOne({
			username: { $regex: `^${contact}$`, $options: "i" },
		})
	}

	return admin
}
