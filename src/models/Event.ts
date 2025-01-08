import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  category:
    | "Technology"
    | "Sport"
    | "Art"
    | "Entertainment"
    | "Health"
    | "Other";
  maxAttendees: number;
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Technology", "Sport", "Art", "Entertainment", "Health", "Other"],
  },
  maxAttendees: { type: Number, required: true, min: 1 },
});

export default mongoose.model<IEvent>("Event", EventSchema);
