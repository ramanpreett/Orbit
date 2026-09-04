import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DatePicker = ({ value, onChange, placeholder = "Select date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  
  const containerRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.preventDefault();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day, e) => {
    e.preventDefault();
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Format to YYYY-MM-DD
    const offset = selectedDate.getTimezoneOffset()
    const finalDate = new Date(selectedDate.getTime() - (offset*60*1000))
    onChange(finalDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = startDayOfMonth(year, month);
    
    const days = [];
    // Empty slots for days before start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    const selectedDateStr = value ? new Date(value).toDateString() : '';

    for (let i = 1; i <= totalDays; i++) {
      const thisDate = new Date(year, month, i);
      const isSelected = value && thisDate.toDateString() === selectedDateStr;
      const isToday = new Date().toDateString() === thisDate.toDateString();
      
      days.push(
        <button
          key={i}
          onClick={(e) => handleDateClick(i, e)}
          className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm transition-all border-2 
            ${isSelected 
              ? 'bg-[#8666F8] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
              : isToday
                ? 'bg-[#FEF08A] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FDE047]'
                : 'bg-white text-black border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className="w-full bg-white border-2 border-black rounded-xl py-2.5 px-3 text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-black' : 'text-slate-400'}>
          {value ? value : placeholder}
        </span>
        <Calendar className="w-5 h-5 text-black" />
      </div>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 p-4 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-[300px]">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePrevMonth}
              className="p-1.5 border-2 border-black rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <div className="font-black text-black uppercase tracking-wider text-sm">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button 
              onClick={handleNextMonth}
              className="p-1.5 border-2 border-black rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-black text-slate-500 uppercase">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 place-items-center">
            {renderDays()}
          </div>
          
          <div className="mt-4 flex justify-between items-center border-t-2 border-black pt-3">
             <button 
               onClick={(e) => { e.preventDefault(); onChange(''); setIsOpen(false); }}
               className="text-xs font-bold text-slate-500 hover:text-black underline"
             >
               Clear
             </button>
             <button 
               onClick={(e) => { 
                 e.preventDefault(); 
                 const now = new Date();
                 const offset = now.getTimezoneOffset()
                 const finalDate = new Date(now.getTime() - (offset*60*1000))
                 onChange(finalDate.toISOString().split('T')[0]); 
                 setIsOpen(false); 
               }}
               className="text-xs font-black px-3 py-1 bg-[#4DE3B1] border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 transition-all"
             >
               Today
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
