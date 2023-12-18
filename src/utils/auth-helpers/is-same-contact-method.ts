export default function isSameContactMethod(user: User, contact: string, contactType: EmailOrPhone): boolean {
	try {
		if (contactType === "Email" && (user.email === contact)) {
			return true
		} else if (contactType === "Phone" && (user.phone === contact)) {
			return true
		}

		return false
	} catch (error) {
		console.error(error)
		return false
	}
}
