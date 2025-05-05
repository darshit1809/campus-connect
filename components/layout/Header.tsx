import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Bell, Settings } from 'lucide-react';
import { isAuthenticated, getCurrentUser, clearAuth } from '../../lib/auth';
import Avatar from '../common/Avatar';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">CC</span>
              <span className="ml-2 text-xl font-semibold text-gray-900">Campus Connect</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/announcements" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Announcements
              </Link>
              <Link to="/events" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Events
              </Link>
              <Link to="/resources" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Resources
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          {/* User Profile and Actions */}
          <div className="flex items-center space-x-4">
            {authenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar name={currentUser?.name || 'User'} size="sm" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/announcements"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Announcements
            </Link>
            <Link
              to="/events"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/resources"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;