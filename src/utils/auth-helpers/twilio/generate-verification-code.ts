export default function generateVerificationCode(): string {
	const verificationCodeLength = 6
	let code = ""
	for (let i = 0; i < verificationCodeLength; i++) {
		code += Math.floor(Math.random() * 10)
	}
	return code
}
