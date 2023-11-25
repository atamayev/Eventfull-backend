import { isValidPhoneNumber } from "libphonenumber-js"
import validator from "validator"

export default function emailOrPhone(input: string): "email" | "phone" | "unknown"  {
	if (validator.isEmail(input)) {
		return "email"
	} else if (isValidPhoneNumber(input, "US")) {
		return "phone"
	} else {
		return "unknown"
	}
}
