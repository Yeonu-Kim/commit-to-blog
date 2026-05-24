import { useState } from 'react';
import postsData from '../../data/blogs.json';
import categoriesData from '../../data/category.json';
import type { Post } from '../../domain/post';
import { type DateRange, FilterBar } from './filter-bar';
import { PostCard } from './post-card';

const allPosts: Post[] = postsData.posts;
const allCategories: string[] = categoriesData.categories;

export const PostSection = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(allPosts);

  const handleSearch = () => {
    const filtered = allPosts
      .filter(
        (post) =>
          selectedCategories.length === 0 ||
          post.categories.some((category) =>
            selectedCategories.includes(category)
          )
      )
      .filter((post) => !dateRange.start || post.date >= dateRange.start)
      .filter((post) => !dateRange.end || post.date <= dateRange.end);

    setFilteredPosts(filtered);
  };

  return (
    <div className="flex flex-col gap-10 px-page-x py-8">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-6">
        <div className="h-7 w-7 shrink-0 rounded-full bg-sky-500" />
        <h3 className="font-bold text-2xl">
          관심 분야에 대해 조사한 글을 읽어보세요.
        </h3>
      </div>

      {/* 필터 바 */}
      <FilterBar
        categories={allCategories}
        selectedCategories={selectedCategories}
        dateRange={dateRange}
        onCategoriesChange={setSelectedCategories}
        onDateRangeChange={setDateRange}
        onSearch={handleSearch}
      />

      {/* 블로그 글 목록 */}
      {filteredPosts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted text-sm">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};
