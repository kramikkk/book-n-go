import * as React from "react"
import { cn } from "@/lib/utils"
import { IconCalendar, IconCheck, IconReceipt, IconTag } from "@tabler/icons-react"

const steps = [
  { label: "Select Date & Time", description: "Choose your preferred slot", icon: IconCalendar },
  { label: "Service & Details", description: "Choose service & your info", icon: IconTag },
  { label: "Review", description: "Review & confirm booking", icon: IconReceipt },
]

interface BookingStepsProps {
  current?: number // 1-based
}

export function BookingSteps({ current = 1 }: BookingStepsProps) {
  return (
    <div className="flex w-full items-start">
      {steps.map((step, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < current
        const isActive = stepNum === current
        const isLast = i === steps.length - 1
        const Icon = step.icon

        return (
          <React.Fragment key={stepNum}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted
                    ? "border-[#3A79C3] bg-[#3A79C3] text-white shadow-sm"
                    : isActive
                    ? "border-[#3A79C3] bg-[#3A79C3]/10 text-[#3A79C3] shadow-[0_0_0_4px_rgba(58,121,195,0.1)]"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <IconCheck className="size-4" stroke={2.5} />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>
              <div className="flex flex-col items-center gap-0.5 text-center">
                <span
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    isActive || isCompleted
                      ? "text-white"
                      : "text-white/60"
                  )}
                >
                  {step.label}
                </span>
                <span className="hidden text-[11px] text-white/60 sm:block">
                  {step.description}
                </span>
              </div>
            </div>

            {/* Connector between steps */}
            {!isLast && (
              <div className="mt-5 h-px flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-[#3A79C3] transition-all duration-500"
                  style={{ width: isCompleted ? "100%" : "0%" }}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
