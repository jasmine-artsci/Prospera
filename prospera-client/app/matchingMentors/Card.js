"use client";

import Image from "next/image";

const Card = ({ title, description, image, buttonText, onClick }) => {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <Image
        src={image}
        alt={title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        {buttonText && (
          <button
            onClick={onClick}
            className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;