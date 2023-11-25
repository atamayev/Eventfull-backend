
import Hash from "../../setup-and-security/hash"
import UserModel from "../../models/user-model"
import { Types } from "mongoose"

export async function doesEmailExist(email: string): Promise<boolean> {
	const user = await UserModel.findOne({
		email: { $regex: `^${email}$`, $options: "i" }
	})
	return user !== null
}

export async function hashPassword(password: string): Promise<{ hashedPassword: string, hashError?: string }> {
	try {
		const hashedPassword = await Hash.hashCredentials(password)
		return { hashedPassword }
	} catch (error) {
		console.error(error)
		return { hashedPassword: "", hashError: "Problem with hashing password" }
	}
}

export async function addUser(email: string, password: string): Promise<Types.ObjectId> {
	const newUser = await UserModel.create({
		email,
		password,
		authMethod: "local",
	})

	return (newUser._id)
}
