export default function ContactDetailsSection({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-5">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg cursor-not-allowed text-gray-600"
            disabled
            title="Email cannot be changed"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Email address cannot be modified
        </p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Mobile Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="+63 XXX XXX XXXX"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Enter your full address"
          rows="3"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
      </div>
    </div>
  );
}
