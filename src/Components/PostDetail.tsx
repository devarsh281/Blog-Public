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
    <Card className="p-28">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-green-800">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {post.image && (
          <div className="mb-4">
            <img
              src={post.image}
              alt={`Image for ${post.title}`}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
        <div className="flex justify-between text-xl text-muted-foreground mb-4">
          <span>Category : {post.category}</span>
          <span>Created At : {new Date(post.date).toLocaleDateString()}</span>
        </div>
        <p>{post.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" onClick={handleBack}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <Card className="max-w-2xl mx-auto my-8">
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
    </CardHeader>
    <CardContent>
      <div className="flex justify-between mb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
  </Card>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <Card className="max-w-2xl mx-auto my-8">
    <CardContent className="text-center text-destructive">
      {message}
    </CardContent>
  </Card>
);

export default PostDetail;
