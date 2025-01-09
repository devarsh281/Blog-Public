import { disAPI } from "@/lib/utils";
import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  date: string;
  title: string;
  category: string;
  description: string;
  views: number;
  image: string;
}

export default function Navbar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Fetch posts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await disAPI("posts/getAll");

        if (Array.isArray(response)) {
          setPosts(response);
          setFilteredPosts(response); // Initialize filtered posts
        } else if (response?.data && Array.isArray(response.data)) {
          setPosts(response.data);
          setFilteredPosts(response.data); // Initialize filtered posts
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Error fetching posts");
      }
    };

    fetchData();
  }, []);

  // Fetch categories data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await disAPI("category/getAll");
        if (Array.isArray(response.data)) {
          const categoryNames = response.data
            .filter((category: { name: string }) => category.name)
            .map((category: { name: string }) => category.name);
          setCategories(["All", ...categoryNames]); // Add 'All' category
        } else {
          console.error("Invalid category data:", response);
          throw new Error("Invalid category data");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Error fetching categories");
      }
    };

    fetchCategory();
  }, []);

  // Filter posts based on search and category
  useEffect(() => {
    const filterPosts = () => {
      let result = posts;

      // Apply search filter
      if (search) {
        result = result.filter(
          (post) =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.description.toLowerCase().includes(search.toLowerCase()) ||
            post.category.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply category filter
      if (selectedCategory !== "All") {
        result = result.filter((post) => post.category === selectedCategory);
      }

      setFilteredPosts(result);
    };

    filterPosts();
  }, [search, selectedCategory, posts]);

  // Handle error if exists
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
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>

          {/* Search bar */}
          <div className="relative mx-4 flex flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-md bg-gray-700 text-white border border-gray-600 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Category dropdown */}
          <Menu as="div" className="relative ml-3">
            <MenuButton className="relative flex rounded-md bg-gray-800 text-sm text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="sr-only">Open category menu</span>
              Categories
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              {categories.map((category) => (
                <MenuItem key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  >
                    {category}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Other components or buttons */}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
