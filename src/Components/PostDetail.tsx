import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { disAPI } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import ShareButton from "./ShareButton";
import { Clock, Heart, MessageCircle, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: number;
  date: string;
  title: string;
  category: string;
  description: string;
  image: string | null;
  likesCount: number;
 
}

interface PostResponse {
  data: Post; 
}

interface Comment {
  text: string;
  dat: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 

  
  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await disAPI(`posts/getID/${id}`);
      const postData = response;
      if (postData.image) {
        postData.image = `http://localhost:8081/posts/images/${id}`;
      }
      setPost(postData);
      const commentsResponse = await disAPI(`posts/getcomment/${id}`);
      setComments(commentsResponse.comments || []);
      // console.log(commentsResponse.comments);

    } catch {
      setError("Error fetching post");
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {

   
    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleBack = () => navigate("/");

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "" || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await disAPI(
        `posts/comment/${id}`,
        "POST",
        JSON.stringify({
          postId: post?.id,
          text: newComment,
        })
      );

      const newCommentData: Comment = response;
      setComments((prevComments) => [newCommentData, ...prevComments]);
      if (id) {
        fetchPost();
      }
      setNewComment("");
      
    } catch {
      setError("Error adding comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleLike = async () => {
    
    try {
      const response = await disAPI(`posts/likepost/${id}`, "POST");
      const updatedPost: PostResponse = response;
      setLikes(updatedPost.data.likesCount);  
      console.log(updatedPost.data.likesCount)
      if (id) {
        fetchPost(); 
      }
    } catch (err) {
      console.error(err);
      setError("Error liking post");
    }
  };


  const toggleComments = () => {
    setShowComments(!showComments);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!post) {
    return <ErrorMessage message="Post not found" />;
  }

  


  const splitText = (text: string, limit: number) => {
    const words = text.split(" ");
    let firstPart = "";
    let secondPart = "";
    let length = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i].trim();

      if (length + word.length + 1 <= limit) {
        firstPart += word + " ";
        length += word.length + 1;
      } else {
        secondPart = words.slice(i).join(" ");
        break;
      }
    }

    return { firstPart: firstPart.trim(), secondPart: secondPart.trim() };
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: -60 }}
    animate={{ opacity: 1, y: 1 }}
    transition={{ duration: 0.5, delay: 0.01 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <Card className="max-w-7xl mx-auto overflow-hidden shadow-2xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
        {" "}
        <CardHeader className="relative py-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-500 opacity-90"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.0 }}
            className="relative z-10"
          >
            <CardTitle className="text-3xl md:text-5xl font-extrabold text-center text-white mb-4">
              {post.title}
            </CardTitle>
            <div className="flex justify-center items-center space-x-4 text-white/80">
              <span className="text-lg font-medium">{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-white/60"></span>
              <span className="text-lg font-medium">
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent className="p-6 md:p-10 flex justify-center items-center min-h-screen">
          <div className="flex flex-col justify-center items-center gap-6 w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full text-center"
            >
              <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                {splitText(post.description, 550).firstPart}
              </p>
            </motion.div>

            {post.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full mx-auto"
              >
                <img
                  src={post.image}
                  alt={`Image for ${post.title}`}
                  className="w-full h-auto object-cover rounded-2xl shadow-lg"
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full text-center"
            >
              <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                {splitText(post.description, 310).secondPart}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full text-center"
            >
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                    onClick={handleLike}
                  >
                    <Heart className="w-5 h-5" fill="" />
                    <span>{likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                    onClick={toggleComments}
                  >
                    <MessageCircle className="w-5 h-5" fill="" />
                    <span>{comments.length}</span>
                  </Button>
                </div>
                <ShareButton
                  postTitle={post.title}
                  postUrl={`https://blog-public-vert.vercel.app/${post.id}`}
                />
              </div>
            </motion.div>
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <h3 className="text-xl font-semibold mb-4">Comments</h3>

                  <div className="mt-4">
                    <textarea
                      value={newComment}
                      onChange={handleCommentChange}
                      placeholder="Add a comment..."
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={isSubmitting || newComment.trim() === ""}
                      className="mt-2 w-full bg-black text-white"
                    >
                      {isSubmitting ? "Submitting..." : "Add Comment"}
                    </Button>
                    <div className="space-y-6 mb-8 mt-6">
                      {comments.map((comment) => (
                        <Card
                          key={comment.text}
                          className="overflow-hidden transition-all duration-300 hover:shadow-md"
                        >
                          <CardContent className="p-0">
                            <div className="flex items-start space-x-4 p-6">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <time dateTime={comment.dat}>
                                      {formatDistanceToNow(
                                        new Date(comment.dat),
                                        { addSuffix: true }
                                      )}
                                    </time>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 break-words">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                              <div className="flex items-center text-xs text-gray-500">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                <span>Reply</span>
                              </div>
                              <div className="text-xs text-gray-500"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Button
            className="bg-gradient-to-r from-blue-900 to-blue-600 text-white hover:from-violet-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg h-12 px-8 rounded-full text-lg font-semibold"
            onClick={handleBack}
          >
            <IoMdArrowRoundBack className="mr-2 text-2xl" /> Back to Posts
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const LoadingSkeleton = () => (
  <div></div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="h-screen w-screen bg-gradient-to-br from-gray-50  to-gray-100 py-32 px-5 sm:px-6 lg:px-8"
  >
    <Card className="max-w-xl h-7xl m-auto overflow-hidden shadow-2xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
      {" "}
      <CardContent className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            className="mx-auto h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-xl font-semibold text-red-600">{message}</p>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);

export default PostDetail;
