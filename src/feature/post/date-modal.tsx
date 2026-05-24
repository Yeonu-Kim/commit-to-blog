import { useState } from 'react';
import type { DateRange } from '../../domain/post';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const toStr = (y: number, m: number, d: number) =>
  `${y}.${String(m + 1).padStart(2, '0')}.${String(d).padStart(2, '0')}`;

const parseStr = (s: string | null): Date | null => {
  if (s === null) {
    return null;
  }
  const [y, m, d] = s.split('.').map(Number);
  return new Date(y, m - 1, d);
};

export const DateModal = ({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [step, setStep] = useState<'start' | 'end'>(
    value.start ? 'end' : 'start'
  );

  const startDate = parseStr(value.start);
  const endDate = parseStr(value.end);

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDay = (day: number) => {
    const clicked = toStr(viewYear, viewMonth, day);
    const clickedDate = new Date(viewYear, viewMonth, day);
    if (step === 'start' || !startDate || clickedDate < startDate) {
      onChange({ start: clicked, end: null });
      setStep('end');
    } else {
      onChange({ ...value, end: clicked });
      setStep('start');
    }
  };

  const getState = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const isStart = startDate?.getTime() === d.getTime();
    const isEnd = endDate?.getTime() === d.getTime();
    const isRange = !!(startDate && endDate && d > startDate && d < endDate);
    return { isStart, isEnd, isRange };
  };

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded p-1 text-lg text-muted leading-none hover:bg-gray-100"
        >
          ‹
        </button>
        <span className="font-semibold text-sm">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          onClick={nextMonth}
          className="rounded p-1 text-lg text-muted leading-none hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-center text-muted text-xs">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) {
            return <div key={`e-${i}`} />;
          }
          const { isStart, isEnd, isRange } = getState(day);
          return (
            <div
              key={day}
              onClick={() => handleDay(day)}
              className={[
                'cursor-pointer rounded py-1.5 text-center text-xs',
                isStart || isEnd ? 'bg-sky-500 font-semibold text-white' : '',
                isRange ? 'bg-sky-100' : '',
                !isStart && !isEnd && !isRange ? 'hover:bg-gray-100' : '',
              ].join(' ')}
            >
              {day}
            </div>
          );
        })}
      </div>

      {value.start && (
        <div className="mt-3 flex items-center justify-between border-border-light border-t pt-3">
          <span className="text-muted text-xs">
            {value.start} ~ {value.end ?? '…'}
          </span>
          <button
            onClick={() => {
              onChange({ start: null, end: null });
              setStep('start');
            }}
            className="text-muted text-xs hover:text-black"
          >
            초기화
          </button>
        </div>
      )}
    </div>
  );
};
