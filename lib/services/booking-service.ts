import { MOCK_BOOKED_DATES, MOCK_BOOKED_SLOTS, MOCK_BOOKINGS } from "../mock-data";
import { Booking } from "../schemas";

// Simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getBookedSlots(date: Date): Promise<string[]> {
  await delay(300); // 300ms network delay simulation
  // In a real app, this would query the DB for slots that intersect with the given day
  return MOCK_BOOKED_SLOTS;
}

export async function getFullyBookedDates(): Promise<Date[]> {
  await delay(300);
  return MOCK_BOOKED_DATES;
}

export async function getAllBookings(): Promise<Booking[]> {
  await delay(500);
  return MOCK_BOOKINGS;
}
