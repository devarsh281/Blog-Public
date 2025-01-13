import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion";
import ShareButton from "./ShareButton";

interface Post {
  id: number;
  date: string;
  title: string;
  category: string;
  description: string;
  image: string | null;
}

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      } catch {
        setError("Error fetching post");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleBack = () => navigate("/");

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!post) {
    return <ErrorMessage message="Post not found" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <Card className="max-w-7xl mx-auto overflow-hidden shadow-2xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="relative py-12 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-500 opacity-90"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
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

        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-10">
            {post.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="md:w-1/2 md:h-auto"
              >
                <img
                  src={post.image}
                  alt={`Image for ${post.title}`}
                  className="w-full h-auto object-cover rounded-2xl shadow-lg "
                />
              </motion.div>
            )}

            <div
              className={post.image ? "md:w-1/2 relative overflow-hidden" : "w-full relative"}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg text-gray-700 leading-relaxed mb-6"
              >
                {post.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <ShareButton
                  postTitle={post.title}
                  postUrl={`https://blog-public-vert.vercel.app/posts/${post.id}`}
                />
              </motion.div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-8">
          <Button
            className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:from-violet-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg h-12 px-8 rounded-full text-lg font-semibold"
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
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
    <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="relative py-12 px-6">
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <div className="flex justify-center items-center space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-10">
          <Skeleton className="h-64 md:w-1/2 rounded-2xl" />
          <div className="md:w-1/2">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <Card className="max-w-2xl w-full bg-white/90 backdrop-blur-sm border-l-4 border-red-500 shadow-2xl rounded-3xl p-8">
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
  </div>
);

export default PostDetail;

