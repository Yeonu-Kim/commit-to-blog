import type { ContributionDay, Month, Week } from '../../domain/github';

const CELL_SIZE = 12;
const CELL_GAP = 4;
const COL_GAP = 3.5;
const COL_STEP = CELL_SIZE + COL_GAP;
const DAY_LABEL_OFFSET = 38;
const MONTH_LABEL_HEIGHT = 20;
const GRID_HEIGHT = 7 * CELL_SIZE + 6 * CELL_GAP;
const LEGEND_MARGIN_TOP = 16;
const LEGEND_HEIGHT = 16;
const CONTAINER_HEIGHT =
  MONTH_LABEL_HEIGHT + GRID_HEIGHT + LEGEND_MARGIN_TOP + LEGEND_HEIGHT;

const LEVEL_CLASSES = [
  'bg-contribution-0',
  'bg-contribution-1',
  'bg-contribution-2',
  'bg-contribution-3',
  'bg-contribution-4',
] as const;
const DAY_LABEL = [
  { label: 'Mon', row: 1 },
  { label: 'Wed', row: 3 },
  { label: 'Fri', row: 5 },
];

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) {
    return 0;
  }
  if (count <= 3) {
    return 1;
  }
  if (count <= 9) {
    return 2;
  }
  if (count <= 19) {
    return 3;
  }
  return 4;
}

export const ContributionGraph = ({
  weeks,
  months,
  selectedDate,
  onSelectDate,
}: {
  weeks: Week[];
  months: Month[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) => {
  const monthCols = months.reduce<{ name: string; col: number }[]>(
    (accumulated, month, monthIndex) => {
      const col =
        monthIndex === 0
          ? 0
          : accumulated[monthIndex - 1].col + months[monthIndex - 1].totalWeeks;
      return [...accumulated, { name: month.name, col }];
    },
    []
  );

  const getFlowerPosition = (selectedDate: string | null) => {
    if (!selectedDate) {
      return null;
    }

    return weeks.reduce<{ x: number; y: number } | null>(
      (accumulated, week, weekIndex) => {
        if (accumulated) {
          return accumulated;
        }
        const day = week.contributionDays.find(
          (contributionDay) => contributionDay.date === selectedDate
        );
        return day
          ? {
              x: DAY_LABEL_OFFSET + weekIndex * COL_STEP,
              y: MONTH_LABEL_HEIGHT + day.weekday * (CELL_SIZE + CELL_GAP),
            }
          : null;
      },
      null
    );
  };

  return (
    <div className="relative w-full" style={{ height: CONTAINER_HEIGHT }}>
      {/* 요일 레이블 */}
      {DAY_LABEL.map(({ label, row }) => (
        <span
          key={label}
          className="absolute font-inter font-normal text-black text-sm leading-none"
          style={{
            left: 0,
            top:
              MONTH_LABEL_HEIGHT +
              row * (CELL_SIZE + CELL_GAP) +
              CELL_SIZE / 2 -
              7,
          }}
        >
          {label}
        </span>
      ))}

      {/* 월 레이블 */}
      {monthCols.map(({ name, col }) => (
        <span
          key={`${name}-${col}`}
          className="absolute whitespace-nowrap font-inter font-normal text-black text-sm leading-none"
          style={{ left: DAY_LABEL_OFFSET + col * COL_STEP, top: 0 }}
        >
          {name}
        </span>
      ))}

      {/* 잔디 그리드 */}
      <div
        className="absolute flex"
        style={{
          left: DAY_LABEL_OFFSET,
          top: MONTH_LABEL_HEIGHT,
          gap: COL_GAP,
        }}
      >
        {weeks.map((week, weekIndex) => {
          const grid: (ContributionDay | null)[] = Array(7).fill(null);
          week.contributionDays.forEach((day) => {
            grid[day.weekday] = day;
          });

          return (
            <div
              key={weekIndex}
              className="flex flex-col"
              style={{ gap: CELL_GAP }}
            >
              {grid.map((day, dayIndex) =>
                day ? (
                  <div
                    key={dayIndex}
                    className={`${LEVEL_CLASSES[getLevel(day.contributionCount)]} cursor-pointer rounded-sm ${
                      day.date === selectedDate ? 'ring-1 ring-black' : ''
                    }`}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      flexShrink: 0,
                    }}
                    onClick={() => onSelectDate(day.date)}
                  />
                ) : (
                  <div
                    key={dayIndex}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      flexShrink: 0,
                    }}
                  />
                )
              )}
            </div>
          );
        })}
      </div>

      {/* 선택된 셀 위 꽃 아이콘 */}
      {getFlowerPosition(selectedDate) && (
        <div
          className="pointer-events-none absolute leading-none"
          style={{
            left: getFlowerPosition(selectedDate)!.x + CELL_SIZE / 2,
            top: getFlowerPosition(selectedDate)!.y - 14,
            transform: 'translateX(-50%)',
            fontSize: 13,
          }}
        >
          🌹
        </div>
      )}

      {/* 범례 */}
      <div
        className="absolute flex items-center gap-1 font-normal font-pretendard text-black text-sm"
        style={{ bottom: 0, right: 0 }}
      >
        <span>Less</span>
        <div className="flex items-center" style={{ gap: 6 }}>
          {LEVEL_CLASSES.map((levelClassName, levelIndex) => (
            <div
              key={levelIndex}
              className={`${levelClassName} rounded-sm`}
              style={{ width: 12, height: 12 }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
