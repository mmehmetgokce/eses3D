import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, Sun, Moon } from 'lucide-react';
import { useRequest } from '../context/RequestContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems } = useRequest();
    const { isDark, toggleTheme } = useTheme();

    const navLinks = [
        { to: '/', label: 'Ana Sayfa' },
        { to: '/urunler', label: 'Ürünler' },
        { to: '/ozel-tasarim', label: 'Özel Tasarım ve İstekler' },
    ];

    return (
        <header className="glass sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-16 md:h-20">
                    {/* Logo - Sol */}
                    <div className="flex-1">
                        <Link to="/" className="flex items-center w-fit">
                            <img
                                src="/logo.jpeg"
                                alt="eses3D Logo"
                                className="h-10 md:h-12 w-auto rounded-lg"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation - Orta */}
                    <nav className="hidden md:flex flex-1 items-center justify-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-300 ${isActive
                                        ? 'text-primary-500'
                                        : 'text-light-600 dark:text-dark-300 hover:text-light-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right Side Actions - Sağ */}
                    <div className="flex-1 flex items-center justify-end space-x-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-light-200 dark:bg-dark-700 text-light-600 dark:text-dark-300 hover:bg-light-300 dark:hover:bg-dark-600 transition-all duration-300"
                            aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Request List Button */}
                        <Link
                            to="/talep-listem"
                            className="relative flex items-center space-x-2 bg-light-200 dark:bg-dark-700 hover:bg-light-300 dark:hover:bg-dark-600 px-4 py-2 rounded-lg transition-all duration-300"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="hidden sm:inline text-sm font-medium">Talep Listem</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center pulse-badge">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-light-600 dark:text-dark-300 hover:text-light-900 dark:hover:text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-light-300 dark:border-dark-700 animate-fade-in">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block py-3 text-sm font-medium transition-colors duration-300 ${isActive
                                        ? 'text-primary-500'
                                        : 'text-light-600 dark:text-dark-300 hover:text-light-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;

