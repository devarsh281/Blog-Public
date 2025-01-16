import React from "react";
import { IoLogoWhatsapp, IoLogoFacebook } from "react-icons/io";
import { motion } from "framer-motion"; 

interface ShareButtonsProps {
  postTitle: string;
  postUrl: string;
}

const ShareButton: React.FC<ShareButtonsProps> = ({ postTitle, postUrl }) => {
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(postTitle)}%20${encodeURIComponent(postUrl)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
  // const instagramShare = `https://www.instagram.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;

  return (
    <div className="flex justify-center gap-6 mt-6">
      <motion.a
        href={whatsappShare}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoLogoWhatsapp size={28} />
      </motion.a>

      <motion.a
        href={facebookShare}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoLogoFacebook size={28} />
      </motion.a>

      {/* <motion.a
        href={instagramShare}
        // target="_blank"
        // rel="noopener noreferrer"
        className="p-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoLogoInstagram size={28} />
      </motion.a> */}
    </div>
  );
};

export default ShareButton;
