import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, MessageCircle } from 'lucide-react';
import { listManagedUsers, updateManagedUserStatus } from '../services/admin';
import ManageUsers from '../components/ManageUsers';
import ManageCourses from '../components/ManageCourses';
import ManageDiscussionChannels from '../components/ManageDiscussionChannels';

const SIDEBAR_ITEMS = [
  { key: 'users', label: 'Manage Users', icon: <Users className="w-5 h-5 mr-2" /> },
  { key: 'courses', label: 'Manage Courses', icon: <BookOpen className="w-5 h-5 mr-2" /> },
  { key: 'discussions', label: 'Manage Discussion Channels', icon: <MessageCircle className="w-5 h-5 mr-2" /> },
];

const AdminDashboard = () => {
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
      active: 'border-[#0f9d58] bg-[#e8f5ee] text-[#0f9d58]',
      inactive: 'border-[#d41929] bg-[#feecee] text-[#d41929]',
      suspended: 'border-[#b26a00] bg-[#fff3e0] text-[#b26a00]',
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e3e6ea] flex flex-col py-8 px-4">
        <h2 className="text-xl font-black text-[#202124] mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`flex items-center px-4 py-2 rounded-lg text-left font-semibold transition-colors ${activeSection === item.key ? 'bg-[#1a73e8] text-white' : 'text-[#202124] hover:bg-[#f1f3f6]'}`}
              onClick={() => setActiveSection(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
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
              </main>
    </div>
  );
};

export default AdminDashboard;
