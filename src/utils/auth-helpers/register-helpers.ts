import _ from "lodash"
import jwt from "jsonwebtoken"
import Hash from "../../setup-and-security/hash"
import UserModel from "../../models/user-model"

export async function doesEmailExist(email: string): Promise<boolean> {
	const user = await UserModel.findOne({ email })
	return user !== null
}

export async function hashPassword(password: string): Promise<{ hashedPassword: string, hashError?: string }> {
	try {
		const hashedPassword = await Hash.hashCredentials(password)
		return { hashedPassword }
	} catch (error: unknown) {
		return { hashedPassword: "", hashError: "Problem with hashing password" }
	}
}

export async function addUser(email: string, password: string): Promise<string> {
	const newUser = await UserModel.create({
		email,
		password,
		authMethod: "local",
	})

	return (_.toString(newUser._id))
}

export function signJWT(payload: object): string | undefined {
	try {
		return jwt.sign(payload, process.env.JWT_KEY)
	} catch (error: unknown) {
		return undefined
	}
}
