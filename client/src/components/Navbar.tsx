import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Search, X, BookOpen, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const isActive = (path: string) => location === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'TIL', path: '/til', icon: BookOpen },
    { name: 'Repositories', path: '/repositories', icon: Github },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">SMONGS</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    href={link.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(link.path)
                        ? 'border-indigo-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:border-gray-300 hover:text-gray-800 dark:hover:text-white'
                    }`}
                  >
                    {link.icon && <link.icon className="mr-1 h-4 w-4" />}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <ThemeToggle />
              <div className="ml-3 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSearch}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center sm:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-indigo-50 dark:bg-gray-700 border-indigo-500 text-indigo-600 dark:text-white'
                      : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-3">
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
