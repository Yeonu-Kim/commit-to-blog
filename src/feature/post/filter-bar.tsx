import type { DateRange } from '../../domain/post';
import { DateModal } from './date-modal';
import { TopicModal } from './topic-modal';
import { ANIMATION, useSlidingPanel } from './use-sliding-panel';

export const FilterBar = ({
  categories,
  selectedCategories,
  dateRange,
  onCategoriesChange,
  onDateRangeChange,
  onSearch,
}: {
  categories: string[];
  selectedCategories: string[];
  dateRange: DateRange;
  onCategoriesChange: (cats: string[]) => void;
  onDateRangeChange: (range: DateRange) => void;
  onSearch: () => void;
}) => {
  const {
    containerRef,
    pillRef,
    topicRef,
    dateRef,
    isOpen,
    isSliding,
    activeFilter,
    displayFilter,
    isContentVisible,
    dropdownLeft,
    dropdownWidth,
    dropdownHeight,
    indicatorLeft,
    indicatorWidth,
    dropdownTransitionProperty,
    dropdownTransitionDuration,
    handleSectionClick,
    handleDropdownTransitionEnd,
    close,
  } = useSlidingPanel();

  const getTopicLabel = (categories: string[]): string | null => {
    if (categories.length === 0) {
      return null;
    }
    if (categories.length === 1) {
      return categories[0];
    }
    return `${categories[0]} 외 ${categories.length - 1}개`;
  };

  const topicLabel = getTopicLabel(selectedCategories);

  const dateLabel = dateRange.start
    ? `${dateRange.start} ~ ${dateRange.end ?? '…'}`
    : null;

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[900px]">
      {/* 필터 바 */}
      <div
        ref={pillRef}
        className={`relative flex w-full items-center rounded-lg border transition-[border-color,background-color] duration-200 ${
          isOpen ? 'border-transparent bg-neutral-100' : 'border-border'
        }`}
      >
        {/* 슬라이딩 인디케이터 */}
        <div
          className={`pointer-events-none absolute inset-y-0 z-0 rounded-lg bg-surface shadow-sm ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: indicatorLeft,
            width: indicatorWidth,
            transitionProperty: isSliding ? 'left, width, opacity' : 'opacity',
            transitionDuration: `${ANIMATION.SLIDE_MS}ms`,
            transitionTimingFunction: 'ease',
          }}
        />

        {/* 주제 필터 */}
        <div
          ref={topicRef}
          role="button"
          tabIndex={0}
          onClick={() => handleSectionClick('topic')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSectionClick('topic');
            }
          }}
          className={`relative z-10 flex-1 cursor-pointer rounded-lg px-6 py-3 transition-colors ${
            isOpen && activeFilter !== 'topic' ? 'hover:bg-neutral-200/60' : ''
          }`}
        >
          <p className="mb-0.5 font-semibold text-xs">주제</p>
          <p className="text-muted text-sm">{topicLabel ?? '주제 검색하기'}</p>
        </div>

        {/* 구분선 */}
        <div
          className={`h-10 w-px shrink-0 bg-border-light transition-opacity duration-200 ${
            activeFilter !== null ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* 날짜 필터 */}
        <div
          ref={dateRef}
          role="button"
          tabIndex={0}
          onClick={() => handleSectionClick('date')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSectionClick('date');
            }
          }}
          className={`relative z-10 flex-1 cursor-pointer rounded-lg px-6 py-3 transition-colors ${
            isOpen && activeFilter !== 'date' ? 'hover:bg-neutral-200/60' : ''
          }`}
        >
          <p className="mb-0.5 font-semibold text-xs">날짜</p>
          <p className="text-muted text-sm">{dateLabel ?? '날짜 추가하기'}</p>
        </div>

        {/* 검색 버튼 */}
        <button
          onClick={() => {
            close();
            onSearch();
          }}
          className="relative z-10 mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white transition-colors hover:bg-sky-600"
          aria-label="검색"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </button>
      </div>

      {/* 드롭다운 패널 */}
      <div
        onTransitionEnd={handleDropdownTransitionEnd}
        className={`absolute top-full z-50 mt-2 overflow-hidden rounded-xl bg-surface shadow-[0_8px_28px_rgba(0,0,0,0.12)] ${
          isOpen
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-[0.97] opacity-0'
        }`}
        style={{
          left: dropdownLeft,
          width: dropdownWidth,
          height: dropdownHeight,
          transitionProperty: dropdownTransitionProperty,
          transitionDuration: dropdownTransitionDuration,
          transitionTimingFunction: 'ease',
        }}
      >
        <div
          style={{
            opacity: isContentVisible ? 1 : 0,
            transition: `opacity ${ANIMATION.FADE_MS}ms ease`,
          }}
        >
          {displayFilter === 'topic' && (
            <TopicModal
              categories={categories}
              selected={selectedCategories}
              onChange={onCategoriesChange}
            />
          )}
          {displayFilter === 'date' && (
            <DateModal value={dateRange} onChange={onDateRangeChange} />
          )}
        </div>
      </div>
    </div>
  );
};
