import type { Post } from '../../domain/post';

export const PostCard = ({ post }: { post: Post }) => (
  <a
    href={post.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex cursor-pointer gap-6"
  >
    <div className="h-[154px] w-[225px] shrink-0 overflow-hidden bg-placeholder">
      <img
        src={post.thumbnail}
        alt={post.title}
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
    <div className="flex flex-col justify-center gap-3">
      <p className="font-bold text-lg group-hover:underline">{post.title}</p>
      <p className="text-muted text-sm">{post.date}</p>
      <p className="text-sm">{post.description}</p>
    </div>
  </a>
);
