import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Bell,
  CircleUserRound,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getUnreadNotifications, markNotificationRead } from '../services/engagement';
import ThemeToggle from '../components/ThemeToggle';

const TeacherLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const pathname = location.pathname || '';
  const isQaNav = pathname.startsWith('/teacher/qa');
  const isCourseNav = pathname.startsWith('/teacher') && !isQaNav;

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await getUnreadNotifications();
        setNotifications(res?.data || []);
      } catch (_err) {
        setNotifications([]);
      }
    };
    fetchUnread();
  }, []);

  const handleMarkRead = async (notification) => {
    try {
      await markNotificationRead(notification._id);
      setNotifications((prev) => prev.filter((item) => item._id !== notification._id));
    } catch (_err) {
      /* non-blocking */
    }
  };

  const headerTitle = isQaNav ? 'Q&A Management' : 'Course Management';

  const navItemClass = (active) =>
    `flex items-center gap-3 w-full px-3 py-2.5 transition-all font-semibold rounded-lg ${
      active
        ? 'bg-primary-container/10 text-primary-container'
        : 'bg-white text-on-surface-variant hover:bg-primary-container/5 border border-transparent'
    }`;

  return (
    <div className="h-screen bg-background text-on-surface font-sans flex overflow-hidden">
      {/* Desktop sidebar — mirrors StudentLayout (width, shadow, collapse rail) */}
      <aside
        className={`${
          isSidebarCollapsed ? 'w-[86px]' : 'w-[300px]'
        } bg-background border-r border-outline/10 hidden lg:flex flex-col z-50 shrink-0 h-full sticky top-0 transition-all duration-300 shadow-[4px_0_12px_rgba(0,0,0,0.02)]`}
      >
        <div
          className={`h-20 flex items-center border-b border-outline/5 px-4 ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}
        >
          <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <GraduationCap className="text-on-primary" size={20} />
          </div>
          {!isSidebarCollapsed && (
            <div>
              <h2 className="text-base font-bold tracking-tight">Entrance Exam Prep</h2>
            </div>
          )}
        </div>
        <div className="p-3 border-b border-outline/5">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((value) => !value)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-outline/10 text-primary-container font-bold text-xs hover:bg-primary-container/5 transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
            {!isSidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>

        <nav className={`flex-grow p-4 space-y-5 overflow-y-auto ${isSidebarCollapsed ? 'hidden' : ''}`}>
          <div className="px-3 py-1 text-[10px] font-black text-outline uppercase tracking-widest">
            Teach
          </div>
          <div className="space-y-2">
            <Link
              to="/teacher"
              className={navItemClass(isCourseNav)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen size={20} /> Course Management
            </Link>
            <Link
              to="/teacher/qa"
              className={navItemClass(isQaNav)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageCircle size={20} /> Q&A Management
            </Link>
          </div>
        </nav>
        <div className={`p-4 border-t border-outline/5 ${isSidebarCollapsed ? 'hidden' : ''}`}>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 transition-all font-semibold rounded-lg"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer — aligned with student drawer widths and surfaces */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            role="presentation"
          />
          <div className="absolute left-0 top-0 bottom-0 w-[min(92vw,380px)] bg-background shadow-2xl flex flex-col">
            <div className="h-16 flex items-center justify-between border-b border-outline/5 px-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-on-primary" size={20} />
                </div>
                <span className="text-sm font-bold">Entrance Exam Prep</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-on-surface-variant p-2 rounded-lg hover:bg-surface"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-grow p-3 space-y-4 overflow-y-auto overscroll-contain pb-6">
              <Link
                to="/teacher"
                className={`${navItemClass(isCourseNav)}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen size={20} /> Course Management
              </Link>
              <Link
                to="/teacher/qa"
                className={`${navItemClass(isQaNav)}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle size={20} /> Q&A Management
              </Link>
            </nav>
            <div className="p-3 border-t border-outline/5 shrink-0 bg-background">
              <button
                type="button"
                onClick={logout}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 text-error font-semibold rounded-xl bg-error/5"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col min-w-0 min-h-0">
        <header className="min-h-[4rem] sm:h-20 bg-header-surface/95 backdrop-blur border-b border-outline/10 px-2.5 sm:px-4 lg:px-gutter grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 sticky top-0 z-40 shrink-0 min-w-0 py-2 sm:py-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-on-surface-variant p-2"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-base sm:text-xl font-semibold tracking-tight text-on-surface truncate min-w-0">
              {headerTitle}
            </h2>
          </div>

          <div className="flex items-center justify-end gap-1 sm:gap-4 shrink-0 flex-nowrap min-w-0 [&>*]:shrink-0">
            <ThemeToggle />
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((v) => !v)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 relative"
                title="Notifications"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[190] bg-on-surface/25 sm:bg-on-surface/10"
                    aria-label="Close notifications"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="fixed left-3 right-3 top-[4.75rem] sm:top-20 sm:left-auto sm:right-4 sm:w-[min(22rem,calc(100vw-2rem))] min-w-0 max-h-[min(22.5rem,min(70vh,calc(100vh-6rem)))] overflow-y-auto overflow-x-hidden rounded-xl border border-outline/10 bg-card shadow-2xl z-[200]">
                  <div className="px-4 py-3 border-b border-outline/10 flex items-center justify-between">
                    <p className="text-sm font-semibold">Notifications</p>
                    <span className="text-xs text-on-surface-variant">
                      {notifications.length} unread
                    </span>
                  </div>
                  <div className="p-2 space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="p-3 rounded-lg border border-outline/10 bg-surface"
                      >
                        <p className="text-sm font-semibold">{notification.title}</p>
                        <p className="text-xs text-on-surface-variant mt-1">{notification.message}</p>
                        <button
                          type="button"
                          onClick={() => handleMarkRead(notification)}
                          className="text-xs text-primary-container font-semibold mt-2"
                        >
                          Mark as read
                        </button>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-sm text-on-surface-variant p-3">No unread notifications.</p>
                    )}
                  </div>
                </div>
                </>
              )}
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">
                Teacher
              </p>
            </div>
            <Link
              to="/profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden hover:opacity-80 transition-opacity shrink-0"
              title="Open profile"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <CircleUserRound size={24} />
              )}
            </Link>
          </div>
        </header>

        {/* Same shell as StudentLayout main column */}
        <main className="flex-grow px-3 py-4 sm:p-gutter overflow-x-hidden overflow-y-auto bg-background">
          <div className="max-w-[1440px] mx-auto">
            <Outlet context={{ teacherShell: true }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
