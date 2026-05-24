import { useEffect, useState } from 'react';
import projectsData from '../../data/projects.json';
import type { Commit } from '../../domain/github';

export const CommitSlider = ({
  projectId,
  commits,
}: {
  projectId: string;
  commits: Commit[];
}) => {
  const displayCommits = commits.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (displayCommits.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayCommits.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [displayCommits.length]);

  const project = projectsData.find((p) => p.id === projectId);
  const title = project?.title ?? projectId;
  const activeCommit = displayCommits[activeIndex];

  return (
    <div className="flex flex-col gap-6">
      <p className="font-normal font-pretendard text-black text-sm">{title}</p>

      {/* 커밋 타임라인 슬라이더 */}
      <div className="flex items-center">
        {displayCommits.map((_, i) => (
          <div key={i} className="flex items-center">
            <button
              className={`h-7 w-7 flex-shrink-0 rounded-full border-2 border-green-400 transition-colors ${
                i === activeIndex ? 'bg-green-400' : 'bg-white'
              }`}
              onClick={() => setActiveIndex(i)}
            />
            {i < displayCommits.length - 1 && (
              <div className="h-0.5 w-20 flex-shrink-0 bg-green-400" />
            )}
          </div>
        ))}
      </div>

      {/* 커밋 정보 */}
      {activeCommit && (
        <div className="flex flex-col items-end gap-2">
          <p className="w-full font-normal font-pretendard text-black text-sm">
            {activeCommit.message}
          </p>
          <a
            href={activeCommit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-muted border-b font-normal font-pretendard text-2xs text-muted"
          >
            커밋으로 바로 가기
          </a>
        </div>
      )}
    </div>
  );
};
