interface TimelineItemProps {
  title: string
  period?: string
  description: string
  details: string[]
}

interface ResumeTimelineProps {
  items: TimelineItemProps[]
}

export function ResumeTimeline({ items }: ResumeTimelineProps) {
  return (
    <div className="space-y-10">
      {items.map((item, index) => (
        <div key={index} className="relative border-l-2 border-muted pl-8 pb-2 theme-border-transition">
          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary theme-transition"></div>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h4 className="text-xl font-bold theme-text-transition">{item.title}</h4>
              {item.period && (
                <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary theme-text-transition">
                  {item.period}
                </span>
              )}
            </div>
            <p className="text-muted-foreground theme-text-transition">{item.description}</p>
            <ul className="list-inside space-y-2 mt-2">
              {item.details.map((detail, detailIndex) => (
                <li key={detailIndex} className="text-sm text-muted-foreground theme-text-transition">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
