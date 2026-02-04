export default function ProfileImageUpload({ imagePreview, onImageChange }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <div className="w-32 h-32 overflow-hidden border-4 border-blue-500 rounded-full flex items-center justify-center bg-gray-100 shadow-lg">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <svg
              className="w-20 h-20 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        <label
          htmlFor="profile-image"
          className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
