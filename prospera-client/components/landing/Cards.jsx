"use client";

import { useState } from "react";
import Image from "next/image";

const Card = ({ name, bio, image, reason, email }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [message, setMessage] = useState("");

//   const handleSend = async () => {
//   try {
//     const response = await fetch("/api/emailContact", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, message, email }),
//     });

//     if (response.ok) {
//       alert("Message sent!");
//       setMessage("");
//       setIsContactModalOpen(false);
//     } else {
//       alert("Failed to send message.");
//     }
//   } catch (error) {
//     console.error("Send error:", error);
//     alert("Something went wrong.");
//   }
// };

const handleSend = async () => {
    alert("Message sent!");
    setMessage("");
    setIsContactModalOpen(false);
};


  return (
    <>
      {/* Card */}
      <div className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <div className="flex justify-center mt-4">
          <Image
            src={image}
            alt={name}
            width={200}
            height={200}
            className="rounded-full"
          />
        </div>
        <div className="p-5 flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          <p className="text-gray-600 text-sm">{bio}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-1/2 px-4 py-2 bg-green-700/40 z-20 text-black rounded-lg text-sm font-medium transition-colors"
            >
              View More
            </button>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="w-1/2 px-4 py-2 bg-green-700/40 z-20 text-black rounded-lg text-sm font-medium transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* View More Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-[90%] shadow-lg">
            <div className="flex justify-center mb-4">
              <Image
                src={image}
                alt={name}
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">{name}</h2>
            <p className="text-gray-700 text-sm">{bio}</p>
            <h3 className="font-bold mt-4 text-green-800">Why is this a good match?</h3>
            <p className="text-sm text-green-700">{reason}</p>
            <div className="text-right mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-[90%] shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Contact {name}</h2>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;