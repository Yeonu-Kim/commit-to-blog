import { useState } from 'react';
import commitsRaw from '../../data/commits.json';
import contributionsData from '../../data/contributions.json';
import type { DayActivity } from '../../domain/github';
import { ActivityPanel } from './activity-panel';
import { ContributionGraph } from './contribution-graph';

const calendar =
  contributionsData.data.user.contributionsCollection.contributionCalendar;

const commitsData = commitsRaw as Record<string, DayActivity>;

const getDefaultDate = (): string | null => {
  return (
    calendar.weeks
      .flatMap((week) => week.contributionDays)
      .findLast((day) => day.contributionCount > 0)?.date ?? null
  );
};

export const GithubSection = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getDefaultDate
  );

  const activity = selectedDate ? (commitsData[selectedDate] ?? null) : null;

  return (
    <section className="flex min-h-[calc(100vh-var(--spacing-header))] flex-col gap-16 pt-12">
      {/* 섹션 타이틀 */}
      <div className="flex items-center gap-6 px-page-x">
        <div className="h-7 w-7 flex-shrink-0 rounded-full bg-green-500" />
        <h2 className="font-bold font-pretendard text-2xl text-black">
          깃허브를 구경해요.
        </h2>
      </div>

      {/* 잔디 영역 */}
      <div className="flex flex-col gap-4 px-page-x">
        <div className="flex w-[418px] flex-col gap-3">
          <p className="font-pretendard font-semibold text-black text-lg">
            무럭무럭 깃허브 땅
          </p>
          <p className="font-normal font-pretendard text-muted text-sm">
            각 블록을 클릭하면 해당일의 활동 내역을 확인할 수 있어요.
          </p>
        </div>

        <ContributionGraph
          weeks={calendar.weeks}
          months={calendar.months}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* 활동 패널 */}
      <div className="px-page-x">
        <ActivityPanel selectedDate={selectedDate} activity={activity} />
      </div>
    </section>
  );
};
