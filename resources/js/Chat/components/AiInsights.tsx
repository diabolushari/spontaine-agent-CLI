import { FiBarChart2 } from "react-icons/fi"; // Importing an icon for insights

export default function AIInsights() {
  return (
    <div className="bg-white  bottom-5 p-6 rounded-2xl shadow-lg w-80"> 


      {/* Header Section */}
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-black text-white px-2 py-1 rounded-md text-sm font-semibold">AI</span>
        <h3 className="text-gray-900 font-bold text-lg">INSIGHTS</h3>
      </div>

      {/* Insight Cards */}
      <div className="bg-blue-100 p-4 rounded-lg flex items-start gap-3 mb-3 shadow">

        <FiBarChart2 className="text-black mt-1" size={20} />
        <p className="text-gray-800 text-sm">
          Arrears above ₹1,000 Cr for the first time in 3 years. 
        </p>

      </div>

      <div className="bg-blue-100 p-4 rounded-lg flex items-start gap-3 shadow">
        <FiBarChart2 className="text-black mt-1" size={20} />
        <p className="text-gray-800 text-sm">
          Significant reduction in outages in January, 2025.{" "}
          <span className="text-purple-600 font-semibold cursor-pointer">View analytics?</span>
        </p>

      </div>
    </div>
  );
}
