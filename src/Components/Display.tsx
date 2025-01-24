"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react";
import { disAPI } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuth } from "./Authentication/AuthContext";
import DOMPurify from "dompurify";

interface Post {
  id: number;
  date: string;
  title: string;
  category: string;
  description: string;
  views: number;
}

const categoryColors: { [key: string]: string } = {
  Sports: "from-pink-400 to-rose-600",
  Travel: "from-teal-400 to-emerald-600",
  Food: "from-orange-400 to-amber-600",
  Fitness: "from-lime-400 to-green-600",
  Entrepreneur: "from-indigo-400 to-purple-600",
  Author: "from-cyan-500 to-cyan-900",
  Gardening: "from-teal-700 to-emerald-800",
};

export default function Display() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      try {
        const response = await disAPI("posts/getAll");

        if (Array.isArray(response)) {
          setPosts(response);
          setFilteredPosts(response);
        } else if (response.data && Array.isArray(response.data)) {
          setPosts(response.data);
          setFilteredPosts(response.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch {
        setError("Error fetching posts");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await disAPI("category/getAll");
        if (Array.isArray(response.data)) {
          const categoryNames = response.data.map(
            (category: { name: string }) => category.name
          );
          setCategories(categoryNames);
        } else {
          console.error("No Category", response);
        }
      } catch {
        setError("Error fetching category");
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [search, selectedCategory, posts]);

  const filterPosts = () => {
    let result = posts;

    if (search) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.description.toLowerCase().includes(search.toLowerCase()) ||
          post.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(result);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const toggleDescription = async (postId: number) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return; 
    }
  
    try {
      const data = await disAPI(`analysis/updateviews/${postId}`);
      console.log(data);
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, views: (post.views || 0) + 1 } : post
        )
      );
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };
  

  if (error) {
    return (
      <div
        className="text-red-500 text-center py-8 bg-red-50 rounded-lg shadow-md max-w-2xl mx-auto mt-10"
        role="alert"
      >
        <span className="text-2xl font-bold block mb-2">Error</span>
        <span className="text-lg">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-150 py-12 px-2 sm:px-4 lg:px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-blue-900 animate-pulse">
            Discover Amazing Blogs
          </h1>
        </motion.div>

        <motion.div
          className="mb-12 flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow text-lg rounded-md border-2 border-violet-200 focus:border-violet-500 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
          />
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[200px] text-lg border-2 border-violet-200 focus:border-violet-500 focus:ring focus:ring-violet-200 focus:ring-opacity-50">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isAuthenticated ? (
            <div className="text- font-medium text-gray-700 self-center">
              Welcome, {user?.username}!
            </div>
          ) : (
            <div className="flex gap-4 self-center">
              <Button
                onClick={() => navigate("/signin")}
                variant="outline"
                className="text-lg text-white bg-black/80 hover:bg-black hover:text-white transition-colors duration-300"
              >
                Login
              </Button>
            </div>
          )}
          {isAuthenticated && (
            <Button
              onClick={logout}
              variant="outline"
              className="text-lg text-white bg-black/80 hover:bg-black hover:text-white transition-colors duration-300"
              >
              Logout
            </Button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex flex-col justify-between h-[300px] bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      className={`bg-gradient-to-r ${
                        categoryColors[post.category] ||
                        "from-gray-500 to-gray-600"
                      } text-white`}
                    >
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-medium line-clamp-2 text-gray-800">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                 <div
                      className="text-gray-600 line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.description),
                      }}
                    />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Eye className="mr-1 h-4 w-4" />
                    {post.views} views
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDescription(post.id)}
                    className="hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-300 hover:text-red-800 transition-all duration-300"
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-12 space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="text-lg hover:bg-violet-100 transition-colors duration-300"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              variant={currentPage === index + 1 ? "default" : "outline"}
              className={`text-lg transition-colors duration-300 ${
                currentPage === index + 1
                  ? "bg-gradient-to-r from-violet-400 to-pink-400 text-white"
                  : "hover:bg-violet-100"
              }`}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            className="text-lg hover:bg-violet-100 transition-colors duration-300"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
