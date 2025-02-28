export default function Loading() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-transparent 
            border-t-blue-600 border-r-purple-600 border-b-pink-600 animate-spin">
          </div>
        </div>
      </div>
    );
  }