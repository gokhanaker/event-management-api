import mongoose, { Schema } from "mongoose";

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  attendedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
      required: true,
    },
    attendedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, //Adds createdAt and updatedAt timestamps
  },
);

export default mongoose.model<IAttendance>("Attendance", attendanceSchema);
