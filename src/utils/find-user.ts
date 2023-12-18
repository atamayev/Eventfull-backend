import { Types, Document } from "mongoose"
import UserModel from "../models/user-model"

export default async function findUser(userId: Types.ObjectId): Promise<
	(Document<unknown, unknown, User> & User & Required<{_id: Types.ObjectId}>) | null
> {
	const user = await UserModel.findById(userId)
	return user as User
}
