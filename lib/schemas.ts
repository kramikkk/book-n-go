import { z } from "zod";

export const bookingTypeSchema = z.enum(["Appointment", "Reservation"]);

export const bookingSchema = z.object({
  id: z.string().optional(),
  ref: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(1, "Contact is required"),
  date: z.date(),
  timeStart: z.string(),
  timeEnd: z.string(),
  type: bookingTypeSchema,
  service: z.string(),
  status: z.enum(["Completed", "Pending", "Canceled", "Confirmed"]),
  location: z.string().optional(),
});

export type Booking = z.infer<typeof bookingSchema>;
export type BookingType = z.infer<typeof bookingTypeSchema>;

export const bookingFormSchema = z.object({
  date: z.date({
    message: "Please select a date.",
  }),
  startTime: z.string({
    message: "Please select a start time.",
  }),
  endTime: z.string({
    message: "Please select an end time.",
  }),
  bookingType: bookingTypeSchema,
  service: z.string().optional(),
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
