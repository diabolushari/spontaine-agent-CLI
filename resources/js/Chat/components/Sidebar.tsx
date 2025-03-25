import { AiOutlineRobot } from "react-icons/ai";
import { FaProjectDiagram, FaFileInvoice, FaCog, FaNetworkWired } from "react-icons/fa";
import { BiGridAlt } from "react-icons/bi";
import { Link } from "react-router-dom"; // Assuming you're using React Router

export default function Sidebar() {
    return (
        <aside className="w-20 bg-gradient-to-b from-gray-100 to-white h-screen flex flex-col items-center py-4 shadow-lg">

            {/* Logo */}
            <img src="/logo.png" alt="KSEB Logo" className="w-12 h-16 mb-6" />

            {/* Sidebar Icons */}
            <div className="flex flex-col gap-4">

            </div>

        </aside>
    );
}
