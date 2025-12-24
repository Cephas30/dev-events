import { Schema, model, models, Document, Model } from 'mongoose';

// Allowed event delivery modes.
export type EventMode = 'online' | 'offline' | 'hybrid';

// Strongly typed Event document.
export interface EventDocument extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // 24h time string (HH:MM)
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Generate URL-friendly slug from the event title.
const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

// Normalize input date to ISO (YYYY-MM-DD) and validate.
const normalizeDateToISO = (dateInput: string): string => {
  const parsed = new Date(dateInput);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid event date');
  }

  return parsed.toISOString().slice(0, 10);
};

// Normalize time to 24h HH:MM format and validate.
const normalizeTimeTo24h = (timeInput: string): string => {
  const trimmed = timeInput.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (!match) {
    throw new Error('Invalid event time');
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid event time');
  }

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');

  return `${hh}:${mm}`;
};

const eventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      enum: ['online', 'offline', 'hybrid'],
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
        message: 'Agenda must contain at least one non-empty item',
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
        message: 'Tags must contain at least one non-empty item',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Ensure slug is unique at the database level.
eventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook: generate slug, normalize date/time, and validate required fields.
eventSchema.pre('save', function (this: EventDocument, next) {
  try {
    // Enforce non-empty required string fields.
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Description is required');
    }
    if (!this.overview || this.overview.trim().length === 0) {
      throw new Error('Overview is required');
    }
    if (!this.image || this.image.trim().length === 0) {
      throw new Error('Image is required');
    }
    if (!this.venue || this.venue.trim().length === 0) {
      throw new Error('Venue is required');
    }
    if (!this.location || this.location.trim().length === 0) {
      throw new Error('Location is required');
    }
    if (!this.audience || this.audience.trim().length === 0) {
      throw new Error('Audience is required');
    }
    if (!this.organizer || this.organizer.trim().length === 0) {
      throw new Error('Organizer is required');
    }

    if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
      throw new Error('Agenda is required');
    }
    if (!Array.isArray(this.tags) || this.tags.length === 0) {
      throw new Error('Tags are required');
    }

    // Generate slug only when the title changes.
    if (this.isModified('title') || !this.slug) {
      this.slug = generateSlug(this.title);
    }

    // Normalize and validate date/time fields for consistency.
    this.date = normalizeDateToISO(this.date);
    this.time = normalizeTimeTo24h(this.time);

    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Event: Model<EventDocument> =
  (models.Event as Model<EventDocument> | undefined) || model<EventDocument>('Event', eventSchema);
