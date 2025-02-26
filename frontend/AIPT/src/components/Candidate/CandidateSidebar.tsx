import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PenTool, Users, Code, User, MoreHorizontal, Settings, LogOut } from 'lucide-react';
import { cn } from "../../lib/Utils";
import { Button } from '../ui/button';

interface MenuItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/candidate-mockup', icon: PenTool, label: 'Mockup-Test' },
  { path: '/interview', icon: Users, label: ' Interview' },
  // { path: '/non-tech-interview', icon: Users, label: 'Non Technical Interview' },
  // { path: '/tech-interview', icon: Code, label: 'Technical Interview' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const bottomMenuItems: MenuItem[] = [
  { path: '/options', icon: MoreHorizontal, label: 'More Options' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/logout', icon: LogOut, label: 'Logout' },
];

const CandidateSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setActive(path || 'dashboard');
  }, [location]);

  const renderMenuItem = (item: MenuItem) => (
    <li key={item.path} className={cn(
      "relative w-full group",
      active === item.path.slice(1) ? "bg-blue-50 dark:bg-blue-950/30" : ""
    )}>
      {active === item.path.slice(1) && (
        <div className="absolute left-0 w-1 bg-blue-600 dark:bg-blue-400 h-full rounded-r" />
      )}
      <Link
        to={item.path}
        className={cn(
          "flex items-center px-4 py-3 transition-all duration-200",
          "hover:bg-blue-50 dark:hover:bg-blue-950/30 w-full rounded-lg",
          isCollapsed ? "justify-center" : "justify-start",
          active === item.path.slice(1) 
            ? "text-blue-600 dark:text-blue-400 font-medium" 
            : "text-gray-700 dark:text-gray-300"
        )}
        onClick={() => setActive(item.path.slice(1))}
      >
        <item.icon className={cn(
          "w-5 h-5 transition-colors",
          !isCollapsed && "mr-3",
          active === item.path.slice(1) 
            ? "text-blue-600 dark:text-blue-400" 
            : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
        )} />
        {!isCollapsed && (
          <span className="text-sm font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {item.label}
          </span>
        )}
      </Link>
    </li>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-white dark:bg-gray-900",
          "border-r border-gray-200 dark:border-gray-800",
          "pt-5 overflow-hidden transition-all duration-300 ease-in-out z-50",
          "shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]",
          isCollapsed ? "w-16" : "w-64"
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-2 mb-6">
            <h2 className={cn(
              "text-xl font-bold text-blue-600 dark:text-blue-400",
              "transition-opacity duration-200",
              isCollapsed && "opacity-0"
            )}>
              Candidate
            </h2>
          </div>

          <nav className="flex-grow px-2">
            <ul className="space-y-1">
              {menuItems.map(renderMenuItem)}
            </ul>
          </nav>

          <div className="mt-auto pb-6 px-2 border-t border-gray-200 dark:border-gray-800 pt-4">
            <ul className="space-y-1">
              {bottomMenuItems.map(renderMenuItem)}
            </ul>
          </div>
        </div>
      </aside>
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Main content */}
      </div>
    </>
  );
};

export default CandidateSidebar;