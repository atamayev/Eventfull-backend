import axios, { AxiosResponse } from "axios"

export default function exchangeCodeForTokenLoginCallback (code: string): Promise<AxiosResponse> {
	const url = `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`
	const params = new URLSearchParams()
	params.append("client_id", process.env.MICROSOFT_CLIENT_ID)
	params.append("scope", "openid profile email")
	params.append("code", code)
	params.append("redirect_uri", "http://localhost:8080/api/auth/microsoft-auth/login-callback")
	params.append("grant_type", "authorization_code")
	params.append("client_secret", process.env.MICROSOFT_SECRET_ID)

	return axios.post(url, params.toString(), {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	})
}
