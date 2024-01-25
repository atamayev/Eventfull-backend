import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function searchForUsername(req: Request, res: Response): Promise<Response> {
	try {
		const username = req.params.username as string
		const user = req.user

		const blockedIds = [
			...user.blockedUsers.map(socialData => socialData.userId),
			...user.blockedByUsers.map(socialData => socialData.userId),
			user._id
		]

		let query
		if (_.isEqual(username, "")) {
			query = { _id: { $nin: blockedIds } }
		} else {
			// eslint-disable-next-line security/detect-non-literal-regexp
			const regex = new RegExp(username, "i")
			query = { _id: { $nin: blockedIds }, username: regex }
		}

		const users = await UserModel.find(query)
			.select("username")
			.limit(10)

		const modifiedUsers = users.map(userDoc => {
			const userObj = userDoc.toObject() as UserWithFriendStatus
			userObj.userId = userObj._id?.toString() as string
			delete userObj._id
			return userObj
		})

		return res.status(200).json({ users: modifiedUsers })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Search for username" })
	}
}
