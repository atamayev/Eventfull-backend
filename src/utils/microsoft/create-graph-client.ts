import { Client } from "@microsoft/microsoft-graph-client"

export default function createGraphClient(accessToken: string): Client {
	const client = Client.init({
		authProvider: (done) => {
			done(null, accessToken)
		},
	})

	return client
}
