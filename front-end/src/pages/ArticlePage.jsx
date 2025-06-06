import {useState} from 'react';
import {useParams, useLoaderData} from 'react-router-dom';
import articles from '../article-content';
import CommentsList from '../CommentsList';
import axios from 'axios';
import AddCommentForm from '../AddCommentForm';
import useUser from '../useUser';

export default function ArticlePage() {
  const { name } = useParams();
  const {upvotes : initialUpvotes, comments: initialComments} = useLoaderData();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [comments, setComments] = useState(initialComments);

  const [buttonText, setButtonText] = useState('Upvote');
  const [upvoteDisabled, setUpvoteDisabled] = useState(false);

  const { isLoading, user } = useUser();

  var upvote = true;

  const article = articles.find(article => article.name === name);
  
  async function onUpvoteClicked(){
    const token = user && await user.getIdToken();
    const headers = token ? { authtoken: token } : {};
    
    const response = axios.post('/api/articles/' + name + '/upvote', null, { headers })
    .then(response =>{
      console.log(response.data);
      const updatedArticleData = response.data;
      setUpvotes(updatedArticleData.upvotes, response.data);
      setButtonText('Already upvoted'); //Need to save the state in mongodb to ensure user cannot upvote again
      setUpvoteDisabled(true); // TO DO add a check to see if user has already upvoted
    }); 
  }

  async function onAddComment({nameText, commentText}){
        const token = user && await user.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = axios.post('/api/articles/' + name + '/comments', {
      postedBy: nameText,
      text: commentText
    }, { headers }).then(response => {
      console.log(response.data);
      const updatedArticleData = response.data;
      setComments([...updatedArticleData.comments,response.data]);
    });
    
    
  }
  return (
    <>
      <h1>{article.title}</h1>
      {user && <button onClick={onUpvoteClicked} disabled={upvoteDisabled}>{buttonText}</button>}
      <p>This article has {upvotes} upvotes!</p>
      {article.content.map(p => <p key={p}>{p}</p>)}
      {user 
        ? <AddCommentForm onAddComment={onAddComment}/>
        : <p>Log in to add a comment</p>
      }
      <CommentsList comments={comments} />
    </>
  );
}

//loads all data needed for the ArticlePage component
export async function loader({params}){
      const response = await axios.get('/api/articles/' + params.name);
      const {upvotes, comments} = response.data;
      return {upvotes, comments};
    } 