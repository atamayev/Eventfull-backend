import _ from "lodash"
import jwt from "jsonwebtoken"
import jwksClient from "jwks-rsa"

// Initialize JWKS client
const client = jwksClient({
	//Remember to replace 'https://login.microsoftonline.com/common/discovery/v2.0/keys'
	// with the appropriate endpoint for your tenant if you are not using the common endpoint.
	jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys"
})

export default function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback): void {
	client.getSigningKey(header.kid, (err, key) => {
		if (err) {
			callback(err, undefined)
		} else {
			if (_.isUndefined(key)) return callback(new Error("Key is undefined"), undefined)
			const signingKey = key.getPublicKey()
			callback(null, signingKey)
		}
	})
}
