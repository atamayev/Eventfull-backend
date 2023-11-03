import UserModel from "../../models/user-model"

type UserDocument = User & Document

export default async function addGoogleUserToDB(email: string): Promise<UserDocument> {
	const newUser = await UserModel.create({
		email,
		authMethod: "google",
	})

	return newUser as UserDocument
}
