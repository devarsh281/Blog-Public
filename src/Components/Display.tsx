import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { disAPI } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Post {
  id: number;
  date: string;
  title: string;
  category: string;
  description: string;
  views:number;
}

const Display: React.FC = () => {
  const navigate = useNavigate(); 
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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
    try {
      const data = await disAPI(`analysis/updateviews/${postId}`); 
      console.log(data);
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, views: (post.views || 0) + 1 }
            : post
        )
      );
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };
  
console.log(posts);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="text-red-500 text-center py-4 bg-red-50 rounded-md"
        role="alert"
      >
        <span className="font-semibold">Error: </span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex gap-4">
        <Input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[200px]">
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
      </div>

      <div>
        <h1 className="text-gray-600 text-left mb-16 mt-8">Latest Blogs</h1>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-400">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.date.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.description.substring(0, 110)}...
                    <button
                      onClick={() => toggleDescription(post.id)}
                      className="text-blue-500 ml-2 text-sm mt-4"
                    >
                      Read More
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            variant={currentPage === index + 1 ? "default" : "outline"}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Display;
