import _ from "lodash"
import { hash as _hash, compare } from "bcrypt"

export default new class Hash {
	async hashCredentials(unhashedData: string): Promise<string> {
		const defaultSaltRounds: number = 10
		const saltRounds = +process.env.SALT_ROUNDS || defaultSaltRounds
		try {
			const hashedData = await _hash(unhashedData, saltRounds)
			return hashedData
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async checkPassword(plaintextPassword: string, hashedPassword: string | undefined): Promise<boolean> {
		try {
			if (_.isUndefined(hashedPassword)) return false
			const isMatch = await compare(plaintextPassword, hashedPassword)
			return isMatch
		} catch (error) {
			console.error(error)
			return false
		}
	}
}()
