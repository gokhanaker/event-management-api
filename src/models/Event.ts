import mongoose, { Document, Schema } from "mongoose";

// TODO later add organizer field to the schema and maybe attendees array as well
export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
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
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Technology", "Sport", "Art", "Entertainment", "Health", "Other"],
  },
  maxAttendees: { type: Number, required: true },
});

export default mongoose.model<IEvent>("Event", EventSchema);
