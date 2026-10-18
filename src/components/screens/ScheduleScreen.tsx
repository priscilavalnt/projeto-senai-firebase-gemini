import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { TattooArtist, TattooWork } from '../../types';

interface ScheduleScreenProps {
  artist: TattooArtist;
  selectedWork?: TattooWork | null;
  onBackToPortfolio: () => void;
  onConfirmSchedule: (date: string, time: string) => void;
  existingBookings?: { date: string; time: string; artistId: string }[];
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  artist,
  selectedWork,
  onBackToPortfolio,
  onConfirmSchedule,
  existingBookings = [],
}) => {
  // Calendar navigation state
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Helper date calculations
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const monthYearLabel = useMemo(() => {
    return currentMonthDate.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentMonthDate]);

  const daysInMonth = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: ({
      dayNumber: number;
      dateStr: string;
      isAvailable: boolean;
      isPast: boolean;
      isCurrentMonth: boolean;
    } | null)[] = [];

    // Empty cells for alignment
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);
      const isPast = dateObj < today;
      const dayOfWeek = dateObj.getDay();
      const isWorkingDay = artist.availableDays.includes(dayOfWeek);

      const yyyy = year;
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      // Check if all slots are booked
      const bookedSlotsCount = existingBookings.filter(
        (b) => b.artistId === artist.id && b.date === dateStr
      ).length;
      const hasAvailableSlots = bookedSlotsCount < artist.timeSlots.length;

      const isAvailable = !isPast && isWorkingDay && hasAvailableSlots;

      days.push({
        dayNumber: d,
        dateStr,
        isAvailable,
        isPast,
        isCurrentMonth: true,
      });
    }

    return days;
  }, [currentMonthDate, today, artist, existingBookings]);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1);
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev >= thisMonthStart) {
      setCurrentMonthDate(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);
    // Limit to next 3 months
    const maxFuture = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    if (next <= maxFuture) {
      setCurrentMonthDate(next);
    }
  };

  // Available slots for selected date
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];

    return artist.timeSlots.map((time) => {
      const isBooked = existingBookings.some(
        (b) => b.artistId === artist.id && b.date === selectedDate && b.time === time
      );
      return {
        time,
        isBooked,
      };
    });
  }, [selectedDate, artist, existingBookings]);

  const handleSelectDay = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime(null);
  };

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, [selectedDate]);

  const handleProceed = () => {
    if (selectedDate && selectedTime) {
      onConfirmSchedule(selectedDate, selectedTime);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToPortfolio}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Portfólio de {artist.name}
        </button>

        <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 uppercase tracking-wider">
          Etapa 1 de 2: Agenda
        </span>
      </div>

      {/* Artist Mini Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-neutral-950">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-500 dark:text-amber-400 font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Agenda Oficial
            </div>
            <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">
              {artist.name}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Especialidade: {artist.specialty}
            </p>
          </div>
        </div>

        {selectedWork && (
          <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800/80 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <img
              src={selectedWork.imageUrl}
              alt={selectedWork.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="text-left text-xs">
              <span className="text-neutral-400 text-[10px] uppercase font-bold block">
                Inspiração selecionada:
              </span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                {selectedWork.title}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Scheduling Grid (Calendar + Time Slots) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Side (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-base text-neutral-900 dark:text-white capitalize">
                {monthYearLabel}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-neutral-400 py-1">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {daysInMonth.map((dayItem, idx) => {
              if (!dayItem) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const isSelected = selectedDate === dayItem.dateStr;

              return (
                <button
                  key={dayItem.dateStr}
                  disabled={!dayItem.isAvailable}
                  onClick={() => handleSelectDay(dayItem.dateStr)}
                  className={`aspect-square rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative ${
                    isSelected
                      ? 'bg-amber-400 text-black shadow-md ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-neutral-900 font-black'
                      : dayItem.isAvailable
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-amber-400/20 hover:text-amber-500 dark:hover:text-amber-400'
                      : 'bg-neutral-50 dark:bg-neutral-900/50 text-neutral-300 dark:text-neutral-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>{dayItem.dayNumber}</span>
                  {dayItem.isAvailable && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Dias Disponíveis
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              Indisponível / Folga
            </span>
          </div>
        </div>

        {/* Time Slots Side (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Horários Disponíveis
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {formattedSelectedDate ? (
                  <span className="text-amber-500 dark:text-amber-400 font-semibold capitalize">
                    {formattedSelectedDate}
                  </span>
                ) : (
                  'Selecione uma data no calendário ao lado'
                )}
              </p>
            </div>

            {selectedDate ? (
              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      disabled={slot.isBooked}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        slot.isBooked
                          ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/60 text-neutral-400 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-amber-400 text-black border-amber-400 shadow-md font-black'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-amber-400 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-2">
                <CalendarIcon className="w-8 h-8 text-neutral-500 opacity-40" />
                <span>Escolha um dia no calendário para liberar os horários de sessão.</span>
              </div>
            )}
          </div>

          {/* Selected Summary and Proceed button */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
            {selectedDate && selectedTime ? (
              <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-neutral-800 dark:text-neutral-200 space-y-1">
                <div className="font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Horário Reservado Preliminarmente
                </div>
                <div className="capitalize font-medium">
                  {formattedSelectedDate} às {selectedTime}
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-400 text-center">
                Selecione o dia e o horário para avançar.
              </div>
            )}

            <button
              disabled={!selectedDate || !selectedTime}
              onClick={handleProceed}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Avançar para Detalhes da Tatuagem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
