import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">ELearning</h4>
            <p className="text-gray-400">Learn at your own pace</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Courses</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="/courses" className="hover:text-white">Browse Courses</a></li>
              <li><a href="/courses?category=programming" className="hover:text-white">Programming</a></li>
              <li><a href="/courses?category=design" className="hover:text-white">Design</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Learning</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white">Dashboard</a></li>
              <li><a href="#" className="hover:text-white">My Courses</a></li>
              <li><a href="#" className="hover:text-white">Progress</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 ELearning Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
