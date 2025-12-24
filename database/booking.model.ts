import { Schema, model, models, Document, Model, Types } from 'mongoose';

import { Event } from './event.model';

// Strongly typed Booking document.
export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple production-ready email validation.
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string): boolean => isValidEmail(value),
        message: 'Email must be a valid address',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index eventId for efficient queries by event.
bookingSchema.index({ eventId: 1 });

// Pre-save hook: validate email and ensure referenced event exists.
bookingSchema.pre('save', async function (this: BookingDocument, next) {
  try {
    if (!this.email || this.email.trim().length === 0) {
      throw new Error('Email is required');
    }

    if (!isValidEmail(this.email)) {
      throw new Error('Email must be a valid address');
    }

    const eventExists = await Event.exists({ _id: this.eventId }).lean().exec();

    if (!eventExists) {
      throw new Error('Cannot create booking for non-existent event');
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Booking: Model<BookingDocument> =
  (models.Booking as Model<BookingDocument> | undefined) || model<BookingDocument>('Booking', bookingSchema);
