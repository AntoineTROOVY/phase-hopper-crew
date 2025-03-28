
import React from 'react';
import { format, isWithinInterval, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface ProjectCalendarProps {
  startDate: string | null | undefined;
  endDate: string | null | undefined;
}

const ProjectCalendar = ({ startDate, endDate }: ProjectCalendarProps) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  // Default to current month if no dates provided
  const defaultMonth = start || new Date();
  
  // Custom day rendering to highlight the project period
  const dayClassNames = (date: Date) => {
    if (!start || !end) return "border border-gray-200 rounded-lg";
    
    // Check if the date is the start or end date
    if (isSameDay(date, start)) {
      return "rounded-xl border-0 bg-[#4E90FF] text-white hover:bg-[#4E90FF] hover:text-white focus:bg-[#4E90FF] focus:text-white";
    }
    
    if (isSameDay(date, end)) {
      return "rounded-xl border-0 bg-[#4E90FF] text-white hover:bg-[#4E90FF] hover:text-white focus:bg-[#4E90FF] focus:text-white";
    }
    
    // Check if the date is within the project period
    if (isWithinInterval(date, { start, end })) {
      return "rounded-lg border-0 bg-[#4E90FF]/20 text-[#4E90FF] hover:bg-[#4E90FF]/30 hover:text-[#4E90FF] focus:bg-[#4E90FF]/30 focus:text-[#4E90FF]";
    }
    
    return "border border-gray-200 rounded-lg";
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return format(date, 'MMM dd, yyyy');
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="font-semibold">Project Timeline</h3>
        {start && end && (
          <div className="text-sm text-gray-500">
            {formatDate(start)} - {formatDate(end)}
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <Calendar
          mode="default"
          defaultMonth={defaultMonth}
          selected={start && end ? { from: start, to: end } : undefined}
          className="rounded-md border"
          classNames={{
            day_selected: "", // Override default selected styling
            day_today: "border border-[#4E90FF]",
            day: "h-9 w-9 p-0 font-normal rounded-lg border border-gray-200",
          }}
          modifiersClassNames={{
            selected: "",
          }}
          components={{
            Day: ({ date, ...props }) => {
              const customClasses = dayClassNames(date);
              
              // Add package icon to the end date
              const isEndDate = end && isSameDay(date, end);
              
              return (
                <button
                  {...props}
                  className={`h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative ${customClasses}`}
                  disabled={true} // Make calendar read-only
                >
                  {props.children}
                  {isEndDate && (
                    <span className="absolute -top-1 -right-1 bg-white rounded-full">
                      <Package className="h-3.5 w-3.5 text-[#4E90FF]" />
                    </span>
                  )}
                </button>
              );
            },
          }}
          disabled
        />
      </CardContent>
    </Card>
  );
};

export default ProjectCalendar;
