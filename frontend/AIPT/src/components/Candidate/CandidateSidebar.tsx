import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTasks, FaUserAlt, FaPen } from 'react-icons/fa';
import { LogOut, Settings } from 'lucide-react';
import { FaNoteSticky } from "react-icons/fa6";
import { Button } from '../ui/button';
import { MoreOptionsIcon } from '../../utils/icons';

const CandidateSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Set active based on current path
        const path = location.pathname.split('/')[1];
        setActive(path || 'dashboard');
    }, [location]);

    const menuItems = [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
        { path: '/candidate-mockup', icon: FaPen, label: 'Mockup-Test' },
        { path: '/non-tech-interview', icon: FaTasks, label: 'Non Technical Interview' },
        { path: '/tech-interview', icon: FaNoteSticky, label: 'Technical Interview' },
        { path: '/profile', icon: FaUserAlt, label: 'Profile' },
    ];

    const bottomMenuItems = [
        { path: '/options', icon: MoreOptionsIcon, label: 'More Options' },
        { path: '/settings', icon: Settings, label: 'Settings' },
        { path: '/logout', icon: LogOut, label: 'Logout' },
    ];

    const renderMenuItem = (item: any, index: number) => (
        <li key={index} className={`relative w-full flex ${active === item.path.slice(1) ? 'bg-orange-50' : ''}`}>
            {active === item.path.slice(1) && (
                <div className="absolute right-0 w-1 bg-orange-500 h-full rounded-l-lg" />
            )}
            <Link
                to={item.path}
                className={`flex items-center px-4 py-2.5 transition-colors duration-300 cursor-pointer rounded hover:bg-[#cce7ff] w-full ${isCollapsed ? 'justify-center' : ''}`}
                onClick={() => setActive(item.path.slice(1))}
            >
                <item.icon className={`text-2xl ${active === item.path.slice(1) ? 'text-[#FF8828]' : 'text-[#32007d]'} mr-2.5`} />
                {!isCollapsed && <span>{item.label}</span>}
            </Link>
        </li>
    );

    return (
        <>
            <div
                className={`fixed left-0 top-0 h-screen bg-white/50 backdrop-blur-lg pt-5 mr-5 shadow-md overflow-y-auto transition-all duration-300 ease-in-out z-[1000] ${isCollapsed ? 'w-20' : 'w-60'}`}
                onMouseEnter={() => setIsCollapsed(false)}
                onMouseLeave={() => setIsCollapsed(true)}
            >
                <ul className="list-none p-0 mt-24 flex flex-col gap-4">
                    {menuItems.map(renderMenuItem)}
                </ul>

                {/* Bottom menu items */}
                <div className="absolute bottom-0 left-0 w-full pb-5">
                    {bottomMenuItems.map((item, index) => (
                        <div key={index} className={`relative w-full flex justify-start pl-5 items-center ${active === item.path.slice(1) ? 'bg-orange-50 ' : ''}`}>
                            {active === item.path.slice(1) && (
                                <div className="absolute right-0 w-1 bg-orange-500 h-full rounded-l-lg " />
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <Link to={item.path} onClick={() => setActive(item.path.slice(1))}>
                                    <item.icon color={active === item.path.slice(1) ? "#FF8828" : "#64728C"} />
                                 
                                </Link>
                            </Button>
                        </div>
                    ))}
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

