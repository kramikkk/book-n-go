import { Booking } from "./schemas";
import { parse } from "date-fns";

export const MOCK_BOOKED_SLOTS = ["10:00 AM", "2:00 PM"];

export const MOCK_BOOKED_DATES = [
  new Date(2026, 2, 7),
  new Date(2026, 2, 10),
  new Date(2026, 2, 14),
];

export const MOCK_BOOKINGS: Booking[] = [
  { ref: "BNG-A1B2C3D4", name: "Alice Johnson", email: "alice@example.com", contact: "+639171234567", date: parse("2026-02-27", "yyyy-MM-dd", new Date()), timeStart: "09:00 AM", timeEnd: "10:00 AM", type: "Appointment", service: "Check-up", status: "Completed" },
  { ref: "BNG-E5F6G7H8", name: "Bob Smith", email: "bob@example.com", contact: "+639282345678", date: parse("2026-02-27", "yyyy-MM-dd", new Date()), timeStart: "11:00 AM", timeEnd: "01:00 PM", type: "Reservation", service: "Conference Hall", status: "Pending" },
  { ref: "BNG-I9J0K1L2", name: "Carol White", email: "carol@example.com", contact: "+639393456789", date: parse("2026-02-28", "yyyy-MM-dd", new Date()), timeStart: "02:00 PM", timeEnd: "03:00 PM", type: "Appointment", service: "Consultation", status: "Completed" },
  { ref: "BNG-M3N4O5P6", name: "David Lee", email: "david@example.com", contact: "+639154567890", date: parse("2026-03-01", "yyyy-MM-dd", new Date()), timeStart: "10:00 AM", timeEnd: "12:00 PM", type: "Reservation", service: "Event Place", status: "Pending" },
  { ref: "BNG-Q7R8S9T0", name: "Eva Martinez", email: "eva@example.com", contact: "+639265678901", date: parse("2026-03-02", "yyyy-MM-dd", new Date()), timeStart: "03:00 PM", timeEnd: "04:00 PM", type: "Appointment", service: "Follow-up", status: "Canceled" },
  { ref: "BNG-U1V2W3X4", name: "Franco Reyes", email: "franco@example.com", contact: "+639176789012", date: parse("2026-03-03", "yyyy-MM-dd", new Date()), timeStart: "08:00 AM", timeEnd: "09:00 AM", type: "Reservation", service: "Room", status: "Completed" },
  { ref: "BNG-Y5Z6A7B8", name: "Grace Santos", email: "grace@example.com", contact: "+639287890123", date: parse("2026-03-03", "yyyy-MM-dd", new Date()), timeStart: "01:00 PM", timeEnd: "02:00 PM", type: "Appointment", service: "Meeting", status: "Pending" },
  { ref: "BNG-C9D0E1F2", name: "Henry Cruz", email: "henry@example.com", contact: "+639398901234", date: parse("2026-03-04", "yyyy-MM-dd", new Date()), timeStart: "10:00 AM", timeEnd: "11:00 AM", type: "Reservation", service: "Table", status: "Completed" },
  { ref: "BNG-G3H4I5J6", name: "Isabel Flores", email: "isabel@example.com", contact: "+639159012345", date: parse("2026-03-04", "yyyy-MM-dd", new Date()), timeStart: "02:00 PM", timeEnd: "03:00 PM", type: "Appointment", service: "Check-up", status: "Canceled" },
  { ref: "BNG-K7L8M9N0", name: "Jose Dela Cruz", email: "jose@example.com", contact: "+639260123456", date: parse("2026-03-05", "yyyy-MM-dd", new Date()), timeStart: "09:00 AM", timeEnd: "11:00 AM", type: "Reservation", service: "Conference Hall", status: "Pending" },
  { ref: "BNG-O1P2Q3R4", name: "Karen Mendoza", email: "karen@example.com", contact: "+639171234568", date: parse("2026-03-05", "yyyy-MM-dd", new Date()), timeStart: "11:00 AM", timeEnd: "12:00 PM", type: "Appointment", service: "Consultation", status: "Completed" },
  { ref: "BNG-S5T6U7V8", name: "Luis Garcia", email: "luis@example.com", contact: "+639282345679", date: parse("2026-03-06", "yyyy-MM-dd", new Date()), timeStart: "03:00 PM", timeEnd: "05:00 PM", type: "Reservation", service: "Event Place", status: "Pending" },
  { ref: "BNG-W9X0Y1Z2", name: "Maria Torres", email: "maria@example.com", contact: "+639393456780", date: parse("2026-03-07", "yyyy-MM-dd", new Date()), timeStart: "08:00 AM", timeEnd: "09:00 AM", type: "Appointment", service: "Follow-up", status: "Completed" },
  { ref: "BNG-A3B4C5D6", name: "Nathan Aquino", email: "nathan@example.com", contact: "+639154567891", date: parse("2026-03-07", "yyyy-MM-dd", new Date()), timeStart: "01:00 PM", timeEnd: "03:00 PM", type: "Reservation", service: "Room", status: "Canceled" },
  { ref: "BNG-E7F8G9H0", name: "Olivia Ramos", email: "olivia@example.com", contact: "+639265678902", date: parse("2026-03-08", "yyyy-MM-dd", new Date()), timeStart: "10:00 AM", timeEnd: "11:00 AM", type: "Appointment", service: "Meeting", status: "Pending" },
];
