import dotenv from "dotenv"
import { ConfidentialClientApplication, Configuration, LogLevel } from "@azure/msal-node"
dotenv.config()

const msalConfig: Configuration = {
	auth: {
		clientId: process.env.MICROSOFT_CLIENT_ID,
		authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
		clientSecret: process.env.MICROSOFT_SECRET_ID
	},
	system: {
		loggerOptions: {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			loggerCallback(loglevel, message, containsPii) {
				console.info(message)
			},
			piiLoggingEnabled: false,
			logLevel: LogLevel.Info,
		}
	}
}

const cca = new ConfidentialClientApplication(msalConfig)

export default cca
