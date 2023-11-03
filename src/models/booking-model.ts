import { Schema, model } from "mongoose"

const bookingSchema = new Schema<Booking>({
	userId: { type: Number, required: true },
	eventId: { type: Number, required: true },
	reviewRating: Number,
	reviewMessage: String,
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const BookingModel = model("Booking", bookingSchema, "bookings")

export default BookingModel
