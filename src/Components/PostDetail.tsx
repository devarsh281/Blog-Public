"use client";

import React, { useEffect, useState } from "react";
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
    >
      <div className="bg-gray-100 min-h-screen">
        <Card className="max-w-8xl mx-auto shadow-lg rounded-lg border border-gray-300 bg-white">
          <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 text-white rounded-t-lg py-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-2xl md:text-5xl font-extrabold text-center  text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 ">
                {post.title}
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {post.image && (
                <div className="sm:w-1/2 mb-4 sm:mb-0">
                  <motion.img
                    src={post.image}
                    alt={`Image for ${post.title}`}
                    className="w-104 h-104 object-cover rounded-lg shadow-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                  <div className="mb-6 flex justify-between mt-5">
                    <div className=" text-lg text-gray-600">
                      <span>
                        Category :
                        <strong className="text-blue-500">
                          {post.category}
                        </strong>
                      </span>
                    </div>
                    <div className=" text-lg text-gray-600">
                      <span className="text-center text-lg">
                        Created On :
                        <strong className="text-blue-500">
                          {new Date(post.date).toLocaleDateString()}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className={post.image ? "sm:w-1/2" : "w-full"}>
                <p className="text-lg text-gray-800 mb-4">{post.description}</p>

                <div className="mt-6 flex flex-col gap-4">
                  <ShareButton
                    postTitle={post.title}
                    postUrl={`https://yourwebsite.com/posts/${post.id}`}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="text-center ">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-6"
              onClick={handleBack}
            >
              <IoMdArrowRoundBack className="mr-2" /> Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton = () => (
  <Card className="max-w-3xl mx-auto my-8 bg-white shadow-lg rounded-lg p-6">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
    </CardHeader>
    <CardContent>
      <div className="flex gap-6">
        <Skeleton className="h-48 w-1/3" />
        <div className="w-2/3">
          <div className="flex justify-between mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <Card className="max-w-2xl mx-auto my-8 bg-red-100 border-l-4 border-red-500 shadow-lg rounded-lg p-8">
    <CardContent className="text-center text-red-600 font-semibold">
      {message}
    </CardContent>
  </Card>
);

export default PostDetail;
