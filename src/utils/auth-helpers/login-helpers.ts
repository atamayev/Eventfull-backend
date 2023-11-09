import _ from "lodash"
import jwt from "jsonwebtoken"
import UserModel from "../../models/user-model"

export async function retrieveUserIdAndPassword(email: string): Promise<{ userId: string, password: string } | undefined> {
	const user = await UserModel.findOne({ email })
	if (_.isNull(user)) return undefined

	return {
		userId: _.toString(user._id),
		password: user.password as string
	}
}

export function signJWT(payload: object): string | undefined {
	try {
		return jwt.sign(payload, process.env.JWT_KEY)
	} catch (error) {
		console.error(error)
		return undefined
	}
}
