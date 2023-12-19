export default function isSameContactMethod(user: User, contact: string, contactType: EmailOrPhone): boolean {
	try {
		if (contactType === "Email") return user.email === contact
		else return user.phone === contact
	} catch (error) {
		console.error(error)
		return false
	}
}
