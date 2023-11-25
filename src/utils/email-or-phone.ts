import validator from "validator"
import { isValidPhoneNumber } from "libphonenumber-js"

export default function emailOrPhone(input: string): EmailOrPhoneOrUnknown  {
	if (validator.isEmail(input)) return "Email"

	else if (isValidPhoneNumber(input, "US")) return "Phone"

	return "Unknown"
}
