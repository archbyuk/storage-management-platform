import React from 'react'

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Drive System Architecture Documentation
        </h1>
        <p className="text-gray-600 mb-4">
          This documentation provides a comprehensive overview of the Drive System architecture, 
          including authentication, storage, synchronization, sharing, and API design.
        </p>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Start Exploring
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
            View System Overview
          </button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">🔐 Authentication</h3>
          <p className="text-sm text-gray-600 mb-3">
            User authentication, OTP verification, and session management
          </p>
          <a href="#auth" className="text-blue-600 text-sm hover:underline">
            Learn more →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📁 Storage</h3>
          <p className="text-sm text-gray-600 mb-3">
            File upload, storage management, and CDN delivery
          </p>
          <a href="#storage" className="text-blue-600 text-sm hover:underline">
            Learn more →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">🔄 Sync</h3>
          <p className="text-sm text-gray-600 mb-3">
            Real-time synchronization and data consistency
          </p>
          <a href="#sync" className="text-blue-600 text-sm hover:underline">
            Learn more →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📤 Share</h3>
          <p className="text-sm text-gray-600 mb-3">
            File sharing, permissions, and collaboration features
          </p>
          <a href="#share" className="text-blue-600 text-sm hover:underline">
            Learn more →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">🔌 API</h3>
          <p className="text-sm text-gray-600 mb-3">
            RESTful API design and integration patterns
          </p>
          <a href="#api" className="text-blue-600 text-sm hover:underline">
            Learn more →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📊 Overview</h3>
          <p className="text-sm text-gray-600 mb-3">
            System architecture overview and technology stack
          </p>
          <a href="#overview" className="text-blue-600 text-sm hover:underline">
            Learn more →
          </a>
        </div>
      </div>

      {/* System Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">10+</div>
            <div className="text-sm text-gray-600">Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600">Core Modules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  )
}
