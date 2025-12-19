import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Dumbbell, Home, AlertTriangle, ArrowRight, Activity } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Main Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <Dumbbell className="w-6 h-6 text-gray-900" />
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Workout Interrupted!
            </h2>
            <p className="text-gray-400 text-lg mb-2">
              The page you're looking for seems to have skipped leg day.
            </p>
            <p className="text-gray-500">
              Don't worry, even the best athletes take wrong turns sometimes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Return to Home
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </a>
            
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-3 px-8 py-4 bg-gray-800 border border-gray-700 text-gray-300 rounded-2xl font-semibold hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              Go Back
            </button>
          </div>

          {/* Gym Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
              <Activity className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">404</div>
              <div className="text-xs text-gray-400">Error Code</div>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
              <Dumbbell className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-gray-400">Recovery Rate</div>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
              <Home className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-gray-400">Click Away</div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="mt-12 p-6 bg-gray-800/30 border border-gray-700 rounded-2xl backdrop-blur-sm">
            <p className="text-gray-400 italic text-sm">
              "The only bad workout is the one that didn't happen. The only bad page is the one that doesn't exist."
            </p>
            <p className="text-gray-500 text-xs mt-2">- Gym Wisdom</p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-20 left-10 opacity-10">
            <Dumbbell className="w-40 h-40 transform rotate-45" />
          </div>
          <div className="absolute -top-20 right-10 opacity-10">
            <Activity className="w-40 h-40 transform -rotate-45" />
          </div>
        </div>

        {/* Footer Note */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-gray-600 text-sm">
            Need help? <a href="/contact" className="text-red-500 hover:text-red-400 transition-colors">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;