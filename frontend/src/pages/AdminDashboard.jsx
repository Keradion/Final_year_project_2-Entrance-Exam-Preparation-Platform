import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, MessageCircle, ShieldCheck, Zap, LogOut, GraduationCap, Layout, User, CircleUserRound, Menu, X } from 'lucide-react';
import { listManagedUsers, updateManagedUserStatus } from '../services/admin';
import { useAuth } from '../context/AuthContext';
import ManageUsers from '../components/ManageUsers';
import ManageSubjects from '../components/ManageCourses';
import ManageDiscussionChannels from '../components/ManageDiscussionChannels';
import { Link } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { key: 'users', label: 'Users', icon: <Users size={20} /> },
  { key: 'subjects', label: 'Subjects', icon: <BookOpen size={20} /> },
  { key: 'discussions', label: 'Discussions', icon: <MessageCircle size={20} /> },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);
      const response = await listManagedUsers({
        q: query || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit,
      });
      setUsers(response?.data || []);
      setTotal(response?.total || 0);
      setPages(response?.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }, [query, roleFilter, statusFilter, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!successMessage) return undefined;

    const timeoutId = setTimeout(() => {
      setSuccessMessage('');
    }, 2400);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';

    try {
      setUpdatingUserId(user._id);
      const response = await updateManagedUserStatus(user._id, nextStatus);
      const updated = response?.data;
      setUsers((prev) => prev.map((item) => (item._id === user._id ? { ...item, ...updated } : item)));
      setSuccessMessage(`${user.firstName} ${user.lastName} is now ${nextStatus === 'active' ? 'Active' : 'Deactive'}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account status.');
    } finally {
      setUpdatingUserId('');
    }
  };

  const statusClassName = useMemo(
    () => ({
      active: 'border-primary-container bg-primary-container/10 text-primary-container',
      inactive: 'border-error bg-error/10 text-error',
      suspended: 'border-on-surface-variant bg-surface-variant/20 text-on-surface-variant',
    }),
    []
  );

  return (
    <div className="h-screen bg-white text-on-surface font-sans flex overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="w-[280px] bg-white border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)] shrink-0 h-full sticky top-0">
        <div className="p-gutter h-20 flex items-center gap-3 border-b border-outline/5 px-8">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-on-primary" size={20} />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Admin</h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <div className="h-4"></div>
          
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 w-full px-4 py-3 transition-all font-semibold rounded-lg border-l-4 ${
                  isActive 
                    ? 'bg-primary-container/10 text-primary-container border-primary-container' 
                    : 'bg-surface text-on-surface-variant border-transparent hover:bg-surface-container-high'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}

        </nav>

        <div className="p-4 border-t border-outline/5">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 transition-all font-semibold rounded-lg">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-gutter h-20 flex items-center justify-between border-b border-outline/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-on-primary" size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight">Admin</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant p-2">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-grow p-4 space-y-2">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => { setActiveSection(item.key); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-3 transition-all font-semibold rounded-lg border-l-4 ${
                      isActive 
                        ? 'bg-primary-container/10 text-primary-container border-primary-container' 
                        : 'bg-surface text-on-surface-variant border-transparent'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-outline/5">
              <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 transition-all font-semibold rounded-lg">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-outline/5 px-4 lg:px-gutter flex items-center justify-between sticky top-0 z-40 shrink-0">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-on-surface-variant p-2">
               <Menu size={24} />
             </button>
             <h2 className="text-xl font-semibold text-on-surface">Dashboard</h2>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold">{user?.firstName || 'Admin'}</p>
                <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">Administrator</p>
             </div>
             <Link to="/profile" className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden hover:opacity-80 transition-opacity">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <CircleUserRound size={24} />
                )}
             </Link>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-gutter overflow-y-auto bg-white">
          <div className="max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeSection === 'users' && (
              <ManageUsers
                users={users}
                query={query}
                setQuery={setQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                page={page}
                setPage={setPage}
                pages={pages}
                total={total}
                isLoading={isLoading}
                error={error}
                successMessage={successMessage}
                fetchUsers={fetchUsers}
                handleToggleStatus={handleToggleStatus}
                updatingUserId={updatingUserId}
                statusClassName={statusClassName}
              />
            )}
            {activeSection === 'subjects' && <ManageSubjects />}
            {activeSection === 'discussions' && <ManageDiscussionChannels />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
