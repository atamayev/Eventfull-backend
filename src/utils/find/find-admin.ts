import _ from "lodash"
import { Types } from "mongoose"
import AdminModel from "../../models/admin-model"

export default async function findAdmin(adminId: Types.ObjectId, select?: string): Promise<Admin | null> {
	let admin
	if (!_.isUndefined(select)) {
		admin = await AdminModel.findById(adminId).select(select).lean()
	} else {
		admin = await AdminModel.findById(adminId).lean()
	}
	return admin
}
