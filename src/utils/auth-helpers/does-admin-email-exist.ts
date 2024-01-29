import AdminModel from "../../models/admin-model"

export default async function doesAdminEmailExist(email: string): Promise<boolean> {
	const admin = await AdminModel.findOne({
		email: { $regex: `^${email}$`, $options: "i" }
	})
	return admin !== null
}
