import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    FileText,
    LogOut,
    Menu,
    X,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('eses3d-admin-token');
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', end: true },
        { to: '/admin/urunler', icon: <Package className="w-5 h-5" />, label: 'Ürünler' },
        { to: '/admin/kategoriler', icon: <FolderOpen className="w-5 h-5" />, label: 'Kategoriler' },
        { to: '/admin/talepler', icon: <FileText className="w-5 h-5" />, label: 'Talepler' },
    ];

    return (
        <div className="min-h-screen bg-light-100 dark:bg-dark-900 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 border-r border-light-300 dark:border-dark-700
        transform transition-transform duration-300 lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-light-300 dark:border-dark-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/logo.jpeg"
                                    alt="eses3D"
                                    className="h-10 w-10 rounded-lg"
                                />
                                <p className="text-light-500 dark:text-dark-400 text-sm font-medium">Admin Panel</p>
                            </div>
                            <button
                                className="lg:hidden text-light-500 dark:text-dark-400"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400'
                                        : 'text-light-600 dark:text-dark-400 hover:bg-light-200 dark:hover:bg-dark-700 hover:text-light-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-light-300 dark:border-dark-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-light-600 dark:text-dark-400 hover:bg-light-200 dark:hover:bg-dark-700 hover:text-light-900 dark:hover:text-white transition-colors w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="bg-white dark:bg-dark-800 border-b border-light-300 dark:border-dark-700 px-4 py-4 lg:px-6">
                    <div className="flex items-center justify-between">
                        <button
                            className="lg:hidden text-light-500 dark:text-dark-400 hover:text-light-900 dark:hover:text-white"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden lg:block">
                            <h1 className="text-lg font-semibold text-light-900 dark:text-white">Yönetim Paneli</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-light-200 dark:bg-dark-700 text-light-600 dark:text-dark-300 hover:bg-light-300 dark:hover:bg-dark-600 transition-all duration-300"
                                aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <a
                                href="/"
                                target="_blank"
                                className="text-light-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm"
                            >
                                Siteyi Görüntüle →
                            </a>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

