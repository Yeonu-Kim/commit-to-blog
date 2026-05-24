import type { DayActivity } from '../../domain/github';
import { CommitSlider } from './commit-slider';

export const ActivityPanel = ({
  selectedDate,
  activity,
}: {
  selectedDate: string | null;
  activity: DayActivity | null;
}) => {
  if (selectedDate === null) {
    return (
      <div className="pb-16">
        <p className="font-pretendard font-semibold text-black text-lg">
          날짜를 선택해 활동을 확인해보세요.
        </p>
      </div>
    );
  }

  const [_, month, day] = selectedDate.split('-').map(Number);
  const title = `${month}월 ${day}일 깃허브 활동을 요약했어요.`;
  const isRestDay = activity === null || activity.totalCount === 0;

  return (
    <div className="flex items-start justify-between pb-16">
      {/* 왼쪽: 활동 요약 */}
      <div className="flex w-[421px] flex-col gap-9">
        <p className="font-pretendard font-semibold text-black text-lg">
          {title}
        </p>
        {isRestDay ? (
          <p className="font-normal font-pretendard text-black text-sm">
            이날은 쉬었어요!
          </p>
        ) : (
          <div className="font-normal font-pretendard text-black text-sm">
            <p>요약</p>
            <ul className="mt-1 ml-5 list-disc space-y-1 leading-relaxed">
              {activity?.summary.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 오른쪽: 주요 커밋 */}
      {!isRestDay && activity && activity.projects.length > 0 && (
        <div className="flex w-[650px] flex-col gap-9">
          <p className="font-pretendard font-semibold text-black text-lg">
            주요 커밋
          </p>
          <div className="flex flex-col gap-8">
            {activity.projects.map((proj) => (
              <CommitSlider
                key={`${proj.projectId}-${selectedDate}`}
                projectId={proj.projectId}
                commits={proj.commits}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
