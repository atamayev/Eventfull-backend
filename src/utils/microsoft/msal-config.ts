import { ConfidentialClientApplication, Configuration, LogLevel } from "@azure/msal-node"

const msalConfig: Configuration = {
	auth: {
		clientId: process.env.MICROSOFT_CLIENT_ID,
		authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_MICROSOFT_TENANT_ID}`,
		clientSecret: process.env.MICROSOFT_SECRET_ID
	},
	system: {
		loggerOptions: {
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
