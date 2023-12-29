import _ from "lodash"
import { Socket } from "socket.io"
import getDecodedId from "../../utils/auth-helpers/get-decoded-id"

export default function jwtVerifyMiddleware (socket: Socket, next: (err?: Error) => void): void {
	const accessToken = socket.handshake.query.accessToken as string

	const userId = getDecodedId(accessToken)
	if (_.isUndefined(userId)) {
		return next(new Error("Authentication error"))
	}

	socket.userId = userId
	next()
}
