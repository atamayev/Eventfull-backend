import { Schema, model } from "mongoose"

const loginHistorySchema = new Schema<LoginHistory>({
	loginTime: { type: Date, default: Date.now },
	// ipAddress: { type: String },
	// device: { type: String }
})

const adminSchema = new Schema<Admin>({
	firstName: { type: String, trim: true, required: true },
	lastName: { type: String, trim: true, required: true},
	email: { type: String, unique: true, trim: true, required: true },
	username: { type: String, trim: true, unique: true, required: true },
	password: { type: String, required: true },

	loginHistory: { type: [loginHistorySchema], required: true },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const AdminModel = model("Admin", adminSchema, "admins")

export default AdminModel
