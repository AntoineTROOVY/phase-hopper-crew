import React, { useState } from 'react';
import { format, isWithinInterval, isSameDay, startOfMonth, endOfMonth, isSameMonth, addMonths, subMonths, differenceInDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectCalendarProps {
  startDate: string | null | undefined;
  endDate: string | null | undefined;
}

const ProjectCalendar = ({ startDate, endDate }: ProjectCalendarProps) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const isMobile = useIsMobile();
  
  // Default to current month if no dates provided
  const [currentMonth, setCurrentMonth] = useState<Date>(start || new Date());
  
  // Get the first and last day of the month to properly bound the view
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  
  // Calculate days remaining until delivery
  const today = new Date();
  const daysRemaining = end ? differenceInDays(end, today) : null;
  
  const navigateMonth = (direction: 'next' | 'prev') => {
    setCurrentMonth(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };
  
  // Custom day rendering to highlight the project period
  const dayClassNames = (date: Date) => {
    if (!start || !end) return "aspect-square rounded-lg border border-gray-200";
    
    // Skip days not in the current month
    if (!isSameMonth(date, currentMonth)) {
      return "hidden";
    }
    
    // Check if the date is the start or end date
    if (isSameDay(date, start)) {
      return "aspect-square rounded-lg border-0 bg-[#4E90FF] text-white hover:bg-[#4E90FF] hover:text-white focus:bg-[#4E90FF] focus:text-white";
    }
    
    if (isSameDay(date, end)) {
      return "aspect-square rounded-lg border-0 bg-[#4E90FF] text-white hover:bg-[#4E90FF] hover:text-white focus:bg-[#4E90FF] focus:text-white";
    }
    
    // Check if the date is within the project period
    if (isWithinInterval(date, { start, end })) {
      return "aspect-square rounded-lg border-0 bg-[#4E90FF]/20 text-[#4E90FF] hover:bg-[#4E90FF]/30 hover:text-[#4E90FF] focus:bg-[#4E90FF]/30 focus:text-[#4E90FF]";
    }
    
    return "aspect-square rounded-lg border border-gray-200";
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return format(date, 'MMM dd, yyyy');
  };
  
  // Helper function to display delivery message
  const getDeliveryMessage = () => {
    if (!end) return null;
    
    if (daysRemaining === null) return null;
    
    if (daysRemaining < 0) {
      return <div className="text-sm text-amber-500 font-medium">Livraison dépassée de {Math.abs(daysRemaining)} jours</div>;
    } else if (daysRemaining === 0) {
      return <div className="text-sm text-green-500 font-medium">Livraison prévue aujourd'hui</div>;
    } else if (daysRemaining === 1) {
      return <div className="text-sm text-blue-500 font-medium">Livraison prévue demain</div>;
    } else {
      return <div className="text-sm text-blue-500 font-medium">Livraison prévue dans {daysRemaining} jours</div>;
    }
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
          {getDeliveryMessage()}
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
        <div className="w-full overflow-hidden">
          <Calendar
            mode="single"
            month={currentMonth}
            defaultMonth={currentMonth}
            selected={undefined}
            fromDate={firstDayOfMonth}
            toDate={lastDayOfMonth}
            className="rounded-md border w-full"
            classNames={{
              day_selected: "", // Override default selected styling
              day_today: "border border-[#4E90FF]",
              day: "font-normal flex items-center justify-center text-xs sm:text-sm aspect-square w-full h-auto rounded-lg",
              cell: "p-0 relative aspect-square", // Set aspect-ratio for the cells
              month: "space-y-2 w-full", 
              row: "grid grid-cols-7 w-full gap-2 mb-2", // Consistent gap for rows
              head_row: "grid grid-cols-7 w-full gap-2 mb-2", // Consistent gap for header row
              caption: "flex justify-center pt-1 relative items-center mb-3",
              table: "w-full",
              caption_label: "text-sm font-medium px-6",
              nav: "hidden", // Hide default navigation since we have custom buttons
              head_cell: "text-muted-foreground text-[0.7rem] sm:text-[0.8rem] font-normal"
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
                    className={`flex items-center justify-center font-normal aria-selected:opacity-100 relative ${customClasses} w-full h-full`}
                    disabled={true} // Make calendar read-only
                    style={{
                      width: '100%',
                      height: '100%',
                      aspectRatio: '1',
                      minWidth: '32px',
                      minHeight: '32px',
                      borderRadius: '8px'
                    }}
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
