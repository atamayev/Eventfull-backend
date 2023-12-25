import { Response, Request } from "express"

export default function getAllDbCalendarEvents (req: Request, res: Response): Response {
	try {
		const user = req.user

		const activeCalendarDetails = user.calendarData.filter(event => event.isActive === true)

		return res.status(200).json({ calendarDetails: activeCalendarDetails })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Fetch Calendar Data" })
	}
}
