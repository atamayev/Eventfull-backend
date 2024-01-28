import validator from "validator"

export default function determineAdminLoginType(input: string): EmailOrUsername  {
	if (validator.isEmail(input)) return "Email"

	return "Username"
}
