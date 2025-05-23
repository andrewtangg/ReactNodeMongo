import ArticlesList from "../ArticlesList";
import articles from "../article-content";


export default function ArticlesListPage() {
  return (
    <>
      <h1>Article</h1>
      <ArticlesList articles={articles} />
    </>
  );
}