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
import Navbar from "./Navbar";

interface Post {
  id: number;
  date: string;
  title: string;
  category: string;
  description: string;
  views:number;
  image:string;
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
    <div>
      <Navbar/>
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
                    {new Date(post.date).toLocaleDateString()}
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
    </div>
  );
};

export default Display;
// "use client"

// import React, { useEffect, useState } from "react"
// import { Loader2, ChevronLeft, ChevronRight, Eye, Calendar, ArrowRight } from 'lucide-react'
// import { disAPI } from "@/lib/utils"
// import { useNavigate } from "react-router-dom"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"

// interface Post {
//   id: number
//   date: string
//   title: string
//   category: string
//   description: string
//   views: number
// }

// const categoryColors: { [key: string]: string } = {
//   Technology: "from-blue-500 to-cyan-500",
//   Travel: "from-green-500 to-emerald-500",
//   Food: "from-yellow-500 to-orange-500",
//   Lifestyle: "from-pink-500 to-rose-500",
//   Fashion: "from-purple-500 to-indigo-500",
// }

// export default function Display() {
//   const navigate = useNavigate()
//   const [posts, setPosts] = useState<Post[]>([])
//   const [categories, setCategories] = useState<string[]>([])
//   const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
//   const [search, setSearch] = useState<string>("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("All")
//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 5

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       setError(null)

//       try {
//         const response = await disAPI("posts/getAll")

//         if (Array.isArray(response)) {
//           setPosts(response)
//           setFilteredPosts(response)
//         } else if (response.data && Array.isArray(response.data)) {
//           setPosts(response.data)
//           setFilteredPosts(response.data)
//         } else {
//           throw new Error("Invalid data format")
//         }
//       } catch {
//         setError("Error fetching posts")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const response = await disAPI("category/getAll")
//         if (Array.isArray(response.data)) {
//           const categoryNames = response.data.map(
//             (category: { name: string }) => category.name
//           )
//           setCategories(categoryNames)
//         } else {
//           console.error("No Category", response)
//         }
//       } catch {
//         setError("Error fetching category")
//       }
//     }
//     fetchCategory()
//   }, [])

//   useEffect(() => {
//     filterPosts()
//   }, [search, selectedCategory, posts])

//   const filterPosts = () => {
//     let result = posts

//     if (search) {
//       result = result.filter(
//         (post) =>
//           post.title.toLowerCase().includes(search.toLowerCase()) ||
//           post.description.toLowerCase().includes(search.toLowerCase()) ||
//           post.category.toLowerCase().includes(search.toLowerCase())
//       )
//     }

//     if (selectedCategory !== "All") {
//       result = result.filter((post) => post.category === selectedCategory)
//     }

//     setFilteredPosts(result)
//     setCurrentPage(1)
//   }

//   const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
//   const indexOfLastPost = currentPage * itemsPerPage
//   const indexOfFirstPost = indexOfLastPost - itemsPerPage
//   const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page)
//     }
//   }

//   const handleCategoryChange = (value: string) => {
//     setSelectedCategory(value)
//   }

//   const toggleDescription = async (postId: number) => {
//     try {
//       const data = await disAPI(`analysis/updateviews/${postId}`)
//       console.log(data)

//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post.id === postId
//             ? { ...post, views: (post.views || 0) + 1 }
//             : post
//         )
//       )
//       navigate(`/posts/${postId}`)
//     } catch (error) {
//       console.error("Error updating view count:", error)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div
//         className="text-red-500 text-center py-4 bg-red-50 rounded-md"
//         role="alert"
//       >
//         <span className="font-semibold">Error: </span>
//         <span>{error}</span>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 bg-gray-100">
//       <div className="mb-8 flex flex-col sm:flex-row gap-4">
//         <Input
//           type="text"
//           placeholder="Search posts..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-grow"
//         />
//         <Select value={selectedCategory} onValueChange={handleCategoryChange}>
//           <SelectTrigger className="w-full sm:w-[200px]">
//             <SelectValue placeholder="Select Category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All">All</SelectItem>
//             {categories.map((category) => (
//               <SelectItem key={category} value={category}>
//                 {category}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-12 text-center">
//         Latest Blogs
//       </h1>

//       <div className="space-y-12">
//         {currentPosts.map((post, index) => (
//           <div 
//             key={post.id} 
//             className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300  
//                         ${index % 2 === 0 ? 'rotate-2' : '-rotate-1'}`}
//           >
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <Badge 
//                   className={`text-lg px-3 py-1 bg-gradient-to-r ${categoryColors[post.category] || 'from-gray-500 to-gray-600'} text-white`}
//                 >
//                   {post.category}
//                 </Badge>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <Calendar className="mr-1 h-4 w-4" />
//                   {new Date(post.date).toLocaleDateString()}
//                 </div>
//               </div>
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 leading-tight">
//                 {post.title}
//               </h2>
//               <p className="text-xl text-gray-600 mb-6 leading-relaxed">
//                 {post.description.substring(0, 150)}...
//               </p>
//               <div className="flex justify-between items-center">
//                 <span className="flex items-center text-gray-500">
//                   <Eye className="mr-1 h-5 w-5" />{post.views} views
//                 </span>
//                 <Button 
//                   onClick={() => toggleDescription(post.id)} 
//                   className="group text-lg"
//                   variant="ghost"
//                 >
//                   Read More
//                   <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
//                 </Button>
//               </div>
//             </div>
//             <div className={`h-2 bg-gradient-to-r ${categoryColors[post.category] || 'from-gray-500 to-gray-600'}`}></div>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-12 space-x-2">
//         <Button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           variant="outline"
//           className="text-lg"
//         >
//           <ChevronLeft className="h-5 w-5 mr-2" />
//           Previous
//         </Button>
//         {[...Array(totalPages)].map((_, index) => (
//           <Button
//             key={index}
//             onClick={() => handlePageChange(index + 1)}
//             variant={currentPage === index + 1 ? "default" : "outline"}
//             className="text-lg"
//           >
//             {index + 1}
//           </Button>
//         ))}
//         <Button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           variant="outline"
//           className="text-lg"
//         >
//           Next
//           <ChevronRight className="h-5 w-5 ml-2" />
//         </Button>
//       </div>
//     </div>
//   )
// }

