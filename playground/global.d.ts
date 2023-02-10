type Post = {
  id: number;
  status: string;
  date_created: string;
  date_updated: string;
  cover: string;
  translations: PostTranslations[];
};

type PostTranslations = {
  id: number;
  post_id: number;
  languages_id: string;
  title: string;
  content: string;
};

type Author = {
  id: number;
  date_created: string;
  date_updated: string;
  name: string;
  country: string;
  posts: Post[];
};

type DirectusCollections = {
  post: Post;
  author: Author;
};
