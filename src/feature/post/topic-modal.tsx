import { useState } from 'react';

export const TopicModal = ({
  categories,
  selected,
  onChange,
}: {
  categories: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) => {
  const [search, setSearch] = useState('');

  const filtered = categories.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (cat: string) => {
    onChange(
      selected.includes(cat)
        ? selected.filter((s) => s !== cat)
        : [...selected, cat]
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-border-light border-b px-4 py-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="주제 검색하기"
          className="w-full bg-transparent text-sm outline-none"
          autoFocus
        />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {filtered.map((cat) => (
          <li
            key={cat}
            className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-gray-50"
            onClick={() => toggle(cat)}
          >
            <input
              type="checkbox"
              checked={selected.includes(cat)}
              onChange={() => toggle(cat)}
              className="cursor-pointer"
            />
            <span className="text-sm">{cat}</span>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-3 text-muted text-sm">
            검색 결과가 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
};
