import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaUserAlt, FaCog, FaPen, FaBars } from 'react-icons/fa';
import { LogOut, LogOutIcon, Settings } from 'lucide-react';
import { FaNoteSticky } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { MoreOptionsIcon } from '../../utils/icons';

const CandidateSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const [active, setActive] = useState<string | null>(null);

    return (
        <>
            <div
                className={`fixed left-0 top-0 h-screen bg-white/50 backdrop-blur-lg pt-5 mr-5 shadow-md overflow-y-auto transition-all duration-300 ease-in-out z-[1000] ${
                    isCollapsed ? 'w-20' : 'w-60'
                }`}
                onMouseEnter={() => setIsCollapsed(false)}
                onMouseLeave={() => setIsCollapsed(true)}
            >
                <ul className="list-none p-0 mt-24 flex flex-col gap-4">
                    <li className={`flex items-center px-4 py-2.5 transition-colors duration-300 cursor-pointer rounded hover:bg-[#cce7ff] ${
                        isCollapsed ? 'justify-center' : ''
                    }`}>
                        <FaHome className="text-2xl text-[#32007d] mr-2.5" />
                        {!isCollapsed && <Link to="/dashboard">Dashboard</Link>}
                    </li>
                    <li className={`flex items-center px-4 py-2.5 transition-colors duration-300 cursor-pointer rounded hover:bg-[#cce7ff] ${
                        isCollapsed ? 'justify-center' : ''
                    }`}>
                        <FaPen className="text-2xl text-[#32007d] mr-2.5" />
                        {!isCollapsed && <Link to="/candidate-mockup">Mockup-Test</Link>}
                    </li>
                    <li className={`flex items-center px-4 py-2.5 transition-colors duration-300 cursor-pointer rounded hover:bg-[#cce7ff] ${
                        isCollapsed ? 'justify-center' : ''
                    }`}>
                        <FaTasks className="text-2xl text-[#32007d] mr-2.5" />
                        {!isCollapsed && <Link to="/non-tech-interview">Non Technical Interview</Link>}
                    </li>
                    <li className={`flex items-center px-4 py-2.5 transition-colors duration-300 cursor-pointer rounded hover:bg-[#cce7ff] ${
                        isCollapsed ? 'justify-center' : ''
                    }`}>
                        <FaNoteSticky className="text-2xl text-[#32007d] mr-2.5" />
                        {!isCollapsed && <Link to="/tech-interview">Technical Interview</Link>}
                    </li>
                    <li className={`flex items-center px-4 py-2.5 transition-colors duration-300 cursor-pointer rounded hover:bg-[#cce7ff] ${
                        isCollapsed ? 'justify-center' : ''
                    }`}>
                        <FaUserAlt className="text-2xl text-[#32007d] mr-2.5" />
                        {!isCollapsed && <Link to="/profile">Profile</Link>}
                    </li>
                </ul>

                {/* More Options, Settings, and Logout */}
                <div className={`relative w-full flex justify-center items-center ${active === "moreOptions" ? 'bg-orange-50' : ''}`}>
                    {active === "moreOptions" && (
                        <div className="absolute right-0 w-1 bg-orange-500 h-full rounded-l-lg" />
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setActive("moreOptions");
                            navigate("options");
                        }}
                    >
                        <MoreOptionsIcon color={active === "moreOptions" ? "#FF8828" : "#64728C"} />
                    </Button>
                </div>

                <div className={`relative w-full flex justify-center items-center ${active === "settings" ? 'bg-orange-50' : ''}`}>
                    {active === "settings" && (
                        <div className="absolute right-0 w-1 bg-orange-500 h-full rounded-l-lg" />
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setActive("settings");
                            navigate("/settings");
                        }}
                    >
                        <Settings color={active === "settings" ? "#FF8828" : "#64728C"} />
                    </Button>
                </div>

                <div className={`relative w-full flex justify-center items-center ${active === "logout" ? 'bg-orange-50' : ''}`}>
                    {active === "logout" && (
                        <div className="absolute right-0 w-1 bg-orange-500 h-full rounded-l-lg" />
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setActive("logout");
                            navigate("/logout");
                        }}
                    >
                        <LogOutIcon color={active === "logout" ? "#FF8828" : "#64728C"} />
                    </Button>
                </div>
            </div>
            {/* Main content wrapper */}
            <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-60'}`}>
                {/* Your main content goes here */}
            </div>
        </>
    );
};

export default CandidateSidebar;