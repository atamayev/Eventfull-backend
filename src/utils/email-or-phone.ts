import validator from "validator"
import { isValidPhoneNumber } from "libphonenumber-js"

export default function emailOrPhone(input: string): EmailOrPhoneOrUnknown  {
	if (validator.isEmail(input) === true) return "Email"

	// Down the line, we'll need to add support for international phone numbers
	else if (isValidPhoneNumber(input, "US") === true) return "Phone"

	return "Unknown"
}
