import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import AwsSnsService from "../../classes/aws-sns-service"
import getUserArn from "../../utils/auth-helpers/aws/get-user-arn"

export default async function logout (req: Request, res: Response): Promise<Response> {
	// Down the line, consider adding a logout history record
	// Consider adding signing a UUID as the JWT, and then storing that UUID in a collection, each linked to a userID
	// Then, when the user logs out, delete that UUID from the database
	try {
		const user = req.user
		const userArn = getUserArn(user.primaryDevicePlatform, user)
		if (!_.isUndefined(userArn)) await AwsSnsService.getInstance().deletePlatformEndpoint(userArn)
		await UserModel.findByIdAndUpdate(user._id,
			{
				$unset: {
					notificationToken: "",
					androidEndpointArn: "",
					iosEndpointArn: ""
				}
			},
			{ runValidators: true }
		)
		return res.status(200).json({ success: "Logout successful" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Logout" })
	}
}
