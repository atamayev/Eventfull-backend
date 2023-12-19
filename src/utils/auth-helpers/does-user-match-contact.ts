export default function doesUserMatchContact (user: User, contact: string, contactType: EmailOrPhone): boolean {
	if (contactType === "Email") return user.email === contact
	else return user.phone === contact
}
