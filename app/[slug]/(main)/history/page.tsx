import { HistoryTable } from '@/components/dashboard/history-table'

export default function HistoryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6">
          <HistoryTable />
        </div>
      </div>
    </div>
  )
}

