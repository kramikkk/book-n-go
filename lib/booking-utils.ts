import { startOfDay, isBefore, isSameDay } from "date-fns";
import { TIME_SLOTS } from "./booking-constants";

export const getSlotIndex = (slot: string) => TIME_SLOTS.indexOf(slot);

export function hasTimeConflict(startTime: string, endTime: string, bookedSlots: string[]): boolean {
  if (!startTime || !endTime) return false;
  const startIdx = getSlotIndex(startTime);
  const endIdx = getSlotIndex(endTime);

  return bookedSlots.some((b) => {
    const bi = getSlotIndex(b);
    return bi > startIdx && bi < endIdx;
  });
}

export function isTimeInRange(slot: string, startTime: string | null, endTime: string | null): boolean {
  if (!startTime || !endTime) return false;
  const i = getSlotIndex(slot);
  return i > getSlotIndex(startTime) && i < getSlotIndex(endTime);
}

export function isTimeDisabled(slot: string, startTime: string | null, endTime: string | null, bookedSlots: string[]): boolean {
  if (bookedSlots.includes(slot)) return true;

  if (startTime && !endTime) {
    const clickedIdx = getSlotIndex(slot);
    const startIdx = getSlotIndex(startTime);
    if (clickedIdx > startIdx && hasTimeConflict(startTime, slot, bookedSlots)) {
      return true;
    }
  }
  return false;
}

export function isDateBooked(date: Date, fullyBookedDates: Date[]): boolean {
  return fullyBookedDates.some((bookedDate) => isSameDay(bookedDate, date));
}

export function isDateInPast(date: Date): boolean {
  const today = startOfDay(new Date());
  return isBefore(date, today);
}
