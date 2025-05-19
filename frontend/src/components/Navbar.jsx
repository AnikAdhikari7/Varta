// external imports
import { Github, LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// internal imports
import useAuthStore from '../store/useAuthStore';

function Navbar() {
    const { logout, authUser } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSettings = () => {
        // If already on /settings, go back, otherwise navigate to /settings
        if (location.pathname.startsWith('/settings')) {
            navigate(-1);
        } else {
            navigate('/settings');
        }
    };

    const toggleProfile = () => {
        // If already on /profile, go back, otherwise navigate to /profile
        if (location.pathname.startsWith('/profile')) {
            navigate(-1);
        } else {
            navigate('/profile');
        }
    };

    return (
        <header
            className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
        >
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
                        >
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">Varta</h1>
                        </Link>
                    </div>

                    <div className="tooltip tooltip-bottom">
                        <div className="tooltip-content">
                            <div className="animate-bounce">
                                Crafted with ❤️ by Anik
                            </div>
                        </div>
                        <a
                            href="https://github.com/AnikAdhikari7/Varta"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="w-6 h-6" />
                        </a>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleSettings}
                            className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </button>

                        {authUser && (
                            <>
                                <button
                                    onClick={toggleProfile}
                                    className={`btn btn-sm gap-2`}
                                >
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">
                                        Profile
                                    </span>
                                </button>

                                <button
                                    className="flex gap-2 items-center"
                                    onClick={logout}
                                >
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">
                                        Logout
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
