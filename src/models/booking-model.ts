import { Schema, model } from "mongoose"

const bookingSchema = new Schema<Booking>({
	userId: { type: Schema.Types.ObjectId, required: true },
	eventId: { type: Schema.Types.ObjectId, required: true },
	reviewRating: {type: Number, required: false},
	reviewMessage:{type: String, required: false},
}, {
	timestamps: true
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const BookingModel = model("Booking", bookingSchema, "bookings")

export default BookingModel
