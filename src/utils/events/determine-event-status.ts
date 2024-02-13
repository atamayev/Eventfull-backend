export default function determineEventStatus(event: EventfullEvent, currentTime: Date): "Future" | "Happening Now" | "Past" {
	let isFuture = false
	let isHappeningNow = false

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const checkTime = (startTime: Date, endTime: Date) => {
		if (currentTime < startTime) isFuture = true
		else if (currentTime >= startTime && currentTime <= endTime) isHappeningNow = true
	}

	if (event.eventFrequency === "one-time" && event.singularEventTime) {
		checkTime(event.singularEventTime.startTime, event.singularEventTime.endTime)
	} else if (event.eventFrequency === "custom" && event.customEventDates) {
		event.customEventDates.forEach(date => {
			checkTime(date.startTime, date.endTime)
		})
	} else if (event.eventFrequency === "ongoing") {
		// Ongoing events are always marked as future
		isFuture = true
	}

	if (isFuture) return "Future"
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (isHappeningNow) return "Happening Now"
	return "Past"
}
