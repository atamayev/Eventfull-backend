export default function setUserContact(primaryContact: EmailOrPhone, user: User): string | undefined {
	let userContact
	if (primaryContact === "Email") userContact = user.email
	else userContact = user.phoneNumber

	return userContact
}
