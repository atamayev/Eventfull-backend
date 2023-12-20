import UserModel from "../../models/user-model"

type UserDocument = User & Document

export default async function addNonLocalUserToDB(email: string, authMethod: "google" | "microsoft"): Promise<UserDocument> {
	const newUser = await UserModel.create({
		email,
		authMethod,
		primaryContactMethod: "Email",
		isEmailVerified: true
	})

	return newUser as UserDocument
}
