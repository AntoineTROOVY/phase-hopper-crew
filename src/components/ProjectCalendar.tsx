
import React, { useState } from 'react';
import { format, isWithinInterval, isSameDay, startOfMonth, endOfMonth, isSameMonth, addMonths, subMonths } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCalendarProps {
  startDate: string | null | undefined;
  endDate: string | null | undefined;
}

const ProjectCalendar = ({ startDate, endDate }: ProjectCalendarProps) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  // Default to current month if no dates provided
  const [currentMonth, setCurrentMonth] = useState<Date>(start || new Date());
  
  // Get the first and last day of the month to properly bound the view
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  
  const navigateMonth = (direction: 'next' | 'prev') => {
    setCurrentMonth(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };
  
  // Custom day rendering to highlight the project period
  const dayClassNames = (date: Date) => {
    if (!start || !end) return "border border-gray-200 rounded-lg";
    
    // Skip days not in the current month
    if (!isSameMonth(date, currentMonth)) {
      return "hidden";
    }
    
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold">Project Timeline</h3>
          {start && end && (
            <div className="text-sm text-gray-500">
              {formatDate(start)} - {formatDate(end)}
            </div>
          )}
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7 rounded-full p-0" 
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7 rounded-full p-0" 
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="w-full max-w-full overflow-x-hidden">
          <Calendar
            mode="single"
            month={currentMonth}
            defaultMonth={currentMonth}
            selected={undefined}
            fromDate={firstDayOfMonth}
            toDate={lastDayOfMonth}
            className="rounded-md border max-w-full"
            classNames={{
              day_selected: "", // Override default selected styling
              day_today: "border border-[#4E90FF]",
              day: "p-0 font-normal rounded-lg border border-gray-200 aspect-square flex items-center justify-center text-xs sm:text-sm",
              cell: "p-0.5 sm:p-1", // Smaller padding on mobile
              month: "space-y-2 max-w-full", // Reduced vertical spacing and width control
              row: "flex w-full mt-1 flex-wrap justify-around", // Flexible row wrapping
              caption: "flex justify-center pt-1 relative items-center mb-1", // Reduced space below the month caption
              table: "w-full border-collapse", // Full width table
              caption_label: "text-sm font-medium px-6", // Add horizontal padding to month label
              head_row: "flex w-full justify-around", // Responsive head row
              nav: "hidden", // Hide default navigation since we have custom buttons
              head_cell: "text-muted-foreground rounded-md text-[0.7rem] sm:text-[0.8rem] w-7 sm:w-9 font-normal"
            }}
            modifiersClassNames={{
              selected: "",
            }}
            components={{
              Day: ({ date, ...props }) => {
                // Skip days that are not in the current month
                if (!isSameMonth(date, currentMonth)) {
                  return null;
                }
                
                const customClasses = dayClassNames(date);
                
                // Add package icon to the end date
                const isEndDate = end && isSameDay(date, end);
                
                return (
                  <button
                    {...props}
                    className={`aspect-square w-7 sm:w-9 flex items-center justify-center font-normal aria-selected:opacity-100 relative ${customClasses}`}
                    disabled={true} // Make calendar read-only
                  >
                    <div>{date.getDate()}</div>
                    {isEndDate && (
                      <span className="absolute -top-1 -right-1 bg-white rounded-full">
                        <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#4E90FF]" />
                      </span>
                    )}
                  </button>
                );
              },
            }}
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCalendar;
