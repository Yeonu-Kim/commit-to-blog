import { useEffect, useRef, useState } from 'react';

export type FilterType = 'topic' | 'date';

export const ANIMATION = {
  SLIDE_MS: 300,
  FADE_MS: 150,
  CONTENT_SWAP_MS: 50,
} as const;

const PANEL_SIZES: Record<FilterType, { width: number; height: number }> = {
  topic: { width: 320, height: 260 },
  date: { width: 296, height: 316 },
};

type DropdownPhase = 'closed' | 'opening' | 'idle';

export const useSlidingPanel = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [displayFilter, setDisplayFilter] = useState<FilterType | null>(null);
  const [dropdownPhase, setDropdownPhase] = useState<DropdownPhase>('closed');
  const [isContentVisible, setIsContentVisible] = useState(true);

  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(PANEL_SIZES.topic.width);
  const [dropdownHeight, setDropdownHeight] = useState(
    PANEL_SIZES.topic.height
  );
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const topicRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const contentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = activeFilter !== null;
  const isSliding = dropdownPhase === 'opening';

  const clearContentTimer = () => {
    if (contentTimerRef.current !== null) {
      clearTimeout(contentTimerRef.current);
      contentTimerRef.current = null;
    }
  };

  const calcDropdownPosition = (filter: FilterType) => {
    const el = filter === 'topic' ? topicRef.current : dateRef.current;
    const container = containerRef.current;
    const pill = pillRef.current;
    if (!el || !container || !pill) {
      return null;
    }

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const panelWidth = PANEL_SIZES[filter].width;
    const buttonLeft = elRect.left - containerRect.left;
    const buttonRight = elRect.right - containerRect.left;

    const left =
      filter === 'topic'
        ? buttonLeft
        : Math.max(
            0,
            Math.min(containerRect.width - panelWidth, buttonRight - panelWidth)
          );

    return {
      left,
      width: panelWidth,
      height: PANEL_SIZES[filter].height,
      indicatorLeft: elRect.left - pillRect.left,
      indicatorWidth: elRect.width,
    };
  };

  const handleSectionClick = (filter: FilterType) => {
    clearContentTimer();

    if (activeFilter === filter) {
      setActiveFilter(null);
      setDropdownPhase('closed');
      return;
    }

    const pos = calcDropdownPosition(filter);
    if (pos) {
      setDropdownLeft(pos.left);
      setDropdownWidth(pos.width);
      setDropdownHeight(pos.height);
      setIndicatorLeft(pos.indicatorLeft);
      setIndicatorWidth(pos.indicatorWidth);
    }

    if (activeFilter === null) {
      setDisplayFilter(filter);
      setIsContentVisible(true);
      setDropdownPhase('idle');
    } else {
      setIsContentVisible(false);
      setDropdownPhase('opening');
      contentTimerRef.current = setTimeout(() => {
        setDisplayFilter(filter);
        contentTimerRef.current = null;
        setIsContentVisible(true);
      }, ANIMATION.CONTENT_SWAP_MS);
    }

    setActiveFilter(filter);
  };

  const handleDropdownTransitionEnd = (
    e: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (e.propertyName === 'left' && dropdownPhase === 'opening') {
      setDropdownPhase('idle');
    }
  };

  const close = () => {
    clearContentTimer();
    setActiveFilter(null);
    setDropdownPhase('closed');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => () => clearContentTimer(), []);

  const dropdownTransitionProperty = isSliding
    ? 'left, width, height, opacity, transform'
    : 'opacity, transform';
  const dropdownTransitionDuration = isSliding
    ? `${ANIMATION.SLIDE_MS}ms, ${ANIMATION.SLIDE_MS}ms, ${ANIMATION.SLIDE_MS}ms, ${ANIMATION.FADE_MS}ms, ${ANIMATION.FADE_MS}ms`
    : `${ANIMATION.FADE_MS}ms, ${ANIMATION.FADE_MS}ms`;

  return {
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
  };
};
