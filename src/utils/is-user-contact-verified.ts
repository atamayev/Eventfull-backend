export default function isUserContactVerified(primaryContact: EmailOrPhone, user: User): boolean {
	let isContactVerified = false
	if (primaryContact === "Email") isContactVerified = user.isEmailVerified || false
	else isContactVerified = user.isPhoneVerified || false

	return isContactVerified
}
