import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, MessageCircle, ShieldCheck, Zap, LogOut, GraduationCap, Layout, User, CircleUserRound } from 'lucide-react';
import { listManagedUsers, updateManagedUserStatus } from '../services/admin';
import { useAuth } from '../context/AuthContext';
import ManageUsers from '../components/ManageUsers';
import ManageCourses from '../components/ManageCourses';
import ManageDiscussionChannels from '../components/ManageDiscussionChannels';
import { Link } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { key: 'users', label: 'Identity Governance', icon: <Users size={20} /> },
  { key: 'courses', label: 'Curriculum Assets', icon: <BookOpen size={20} /> },
  { key: 'discussions', label: 'Communication Hub', icon: <MessageCircle size={20} /> },
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
      setSuccessMessage(`${user.firstName} ${user.lastName} is now ${nextStatus}.`);
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
    <div className="min-h-screen bg-surface text-on-surface font-sans flex overflow-hidden">
      {/* Institutional Sidebar */}
      <aside className="w-[280px] bg-white border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)] shrink-0 h-screen sticky top-0">
        <div className="p-gutter h-20 flex items-center gap-3 border-b border-outline/5">
          <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center">
            <ShieldCheck className="text-on-primary" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">Governance OS</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-4 mb-4 mt-2">Core Operations</p>
          
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-all font-medium ${activeSection === item.key ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="h-[1px] bg-outline/5 my-6 mx-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-4 mb-4">Identity</p>
          
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface transition-all font-medium">
            <Layout size={20} />
            Landing Portal
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface transition-all font-medium">
            <User size={20} />
            My Account
          </Link>
        </nav>

        <div className="p-4 border-t border-outline/5">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded text-error hover:bg-error/5 transition-all font-medium">
            <LogOut size={20} />
            Terminate Access
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-outline/5 px-gutter flex items-center justify-between sticky top-0 z-40 shrink-0">
           <div>
             <h2 className="text-lg font-bold text-on-surface">Institutional Governance Console</h2>
             <p className="text-xs text-on-surface-variant uppercase tracking-widest font-black">Admin Level 4 Authorization</p>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold">{user?.firstName || 'Admin'}</p>
               <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">Root Authority</p>
             </div>
             <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <ShieldCheck size={24} />
                )}
             </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-gutter overflow-y-auto bg-surface/50">
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
            {activeSection === 'courses' && <ManageCourses />}
            {activeSection === 'discussions' && <ManageDiscussionChannels />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
