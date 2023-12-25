import UserModel from "../../models/user-model"

export default async function addNonLocalUserToDB(
	email: string,
	firstName: string,
	lastName: string,
	authMethod: CloudAuthSources
): Promise<User> {
	const newUser = await UserModel.create({
		email,
		authMethod,
		primaryContactMethod: "Email",
		isEmailVerified: true,
		firstName,
		lastName
	})

	return newUser
}
