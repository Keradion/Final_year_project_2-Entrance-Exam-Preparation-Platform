import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, MessageCircle, ShieldCheck, LogOut, CircleUserRound, Menu, X, TriangleAlert, LayoutDashboard } from 'lucide-react';
import { listManagedUsers, updateManagedUserStatus } from '../services/admin';
import { useAuth } from '../context/AuthContext';
import ManageUsers from '../components/ManageUsers';
import ManageSubjects from '../components/ManageCourses';
import ManageDiscussionChannels from '../components/ManageDiscussionChannels';
import { getIssuesForReview, updateIssueStatus } from '../services/engagement';
import ThemeToggle from '../components/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { key: 'users', label: 'Users', icon: <Users size={20} /> },
  { key: 'subjects', label: 'Subjects', icon: <BookOpen size={20} /> },
  { key: 'issues', label: 'Issues', icon: <TriangleAlert size={20} /> },
  { key: 'discussions', label: 'Discussions', icon: <MessageCircle size={20} /> },
];

const ISSUE_FILTERS = [
  { label: 'All', value: '', helper: 'Every report' },
  { label: 'Submitted', value: 'open', helper: 'Needs review' },
  { label: 'In-progress', value: 'in-progress', helper: 'Being handled' },
  { label: 'Resolved', value: 'resolved', helper: 'Solved' },
  { label: 'Closed', value: 'closed', helper: 'Archived' },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
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
  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issueStatusFilter, setIssueStatusFilter] = useState('');

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

  const fetchIssues = useCallback(async () => {
    try {
      setIssuesLoading(true);
      const res = await getIssuesForReview(issueStatusFilter ? { status: issueStatusFilter } : {});
      setIssues(res?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load issues.');
    } finally {
      setIssuesLoading(false);
    }
  }, [issueStatusFilter]);

  useEffect(() => {
    if (activeSection === 'issues' || activeSection === 'dashboard') {
      fetchIssues();
    }
  }, [activeSection, fetchIssues]);

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

  const handleIssueStatusUpdate = async (issue, issueStatus) => {
    try {
      const response = await updateIssueStatus(issue._id, {
        issueStatus,
        response: issueStatus === 'resolved' ? 'Issue resolved by admin review.' : issue.response || ''
      });
      const updated = response?.data;
      setIssues((prev) => {
        const next = prev.map((it) => (it._id === issue._id ? updated : it));
        return issueStatusFilter && updated?.issueStatus !== issueStatusFilter
          ? next.filter((it) => it._id !== issue._id)
          : next;
      });
      setSuccessMessage(`Issue "${issue.title}" updated to ${issueStatus}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update issue status.');
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

  const issueStatusClassName = useMemo(
    () => ({
      open: 'bg-error/10 text-error border-error/20',
      'in-progress': 'bg-primary-container/10 text-primary-container border-primary-container/20',
      resolved: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-200 border-green-100 dark:border-green-800',
      closed: 'bg-surface-variant/30 text-on-surface-variant border-outline/10',
    }),
    []
  );

  const activeSectionLabel = SIDEBAR_ITEMS.find((item) => item.key === activeSection)?.label || 'Dashboard';

  return (
    <div className="h-screen bg-background text-on-surface font-sans flex overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="w-[280px] bg-background border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)] shrink-0 h-full sticky top-0">
        <button
          type="button"
          onClick={() => setActiveSection('dashboard')}
          className="h-20 flex items-center gap-3 border-b border-outline/5 px-6 text-left hover:bg-primary-container/5 transition-colors"
        >
          <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center shadow-sm">
            <ShieldCheck className="text-on-primary" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Entrance Exam Prep</h2>
            <p className="text-[10px] font-black text-primary-container uppercase tracking-widest">Admin</p>
          </div>
        </button>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => item.path ? navigate(item.path) : setActiveSection(item.key)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 transition-all font-semibold rounded-lg ${
                  isActive 
                    ? 'bg-primary-container/10 text-primary-container' 
                    : 'text-on-surface-variant hover:bg-primary-container/5'
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
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-background shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-gutter h-20 flex items-center justify-between border-b border-outline/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-on-primary" size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight">Entrance Exam Prep</span>
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
                    onClick={() => { 
                      if (item.path) navigate(item.path);
                      else { setActiveSection(item.key); setIsMobileMenuOpen(false); }
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 transition-all font-semibold rounded-lg ${
                      isActive 
                        ? 'bg-primary-container/10 text-primary-container' 
                        : 'text-on-surface-variant hover:bg-primary-container/5'
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
        <header className="min-h-[4rem] sm:h-20 bg-header-surface/95 backdrop-blur border-b border-outline/10 px-2.5 sm:px-4 lg:px-gutter grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 sticky top-0 z-40 shrink-0 min-w-0 py-2 sm:py-0">
           <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
             <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-on-surface-variant p-2 shrink-0 rounded-lg hover:bg-surface" aria-label="Open menu">
               <Menu size={24} />
             </button>
            <h2 className="text-base sm:text-xl font-semibold text-on-surface truncate min-w-0">{activeSectionLabel}</h2>
           </div>
           
           <div className="flex items-center justify-end gap-1 sm:gap-4 shrink-0 flex-nowrap min-w-0 [&>*]:shrink-0">
             <ThemeToggle />
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold">{user?.firstName || 'Admin'}</p>
                <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">Admin</p>
             </div>
             <Link to="/profile" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden hover:opacity-80 transition-opacity shrink-0">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <CircleUserRound size={24} />
                )}
             </Link>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow px-3 py-4 sm:p-gutter overflow-x-hidden overflow-y-auto bg-background">
          <div className="max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <section className="bg-white rounded-xl border border-outline-variant p-4 sm:p-6 md:p-8 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container">Dashboard</p>
                      <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-2 break-words">
                        Welcome back, {user?.firstName || 'Admin'}
                      </h2>
                      <p className="text-sm text-on-surface-variant mt-3 max-w-2xl">
                        Manage users, courses, student reports, and discussion spaces from one clean workspace.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-primary-container/10 border border-primary-container/10 px-5 py-4 text-center">
                        <p className="text-2xl font-black text-primary-container">{total}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Users</p>
                      </div>
                      <div className="rounded-lg bg-surface border border-outline/10 px-5 py-4 text-center">
                        <p className="text-2xl font-black text-on-surface">{issues.length}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Issues</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {SIDEBAR_ITEMS.filter((item) => item.key !== 'dashboard').map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveSection(item.key)}
                      className="rounded-xl border border-outline/10 p-5 text-left transition-all bg-white text-on-surface hover:bg-primary-container/5 hover:border-primary-container/20 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center mb-4">
                        {item.icon}
                      </div>
                      <p className="text-base font-black">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-2">Open {item.label.toLowerCase()} management.</p>
                    </button>
                  ))}
                </section>
              </div>
            )}
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
            {activeSection === 'issues' && (
              <div className="space-y-6">
                <section className="bg-white rounded-xl border border-outline-variant p-4 sm:p-6 md:p-8 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container">Issue Review Center</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-on-surface mt-2 break-words">Reported Issues</h3>
                      <p className="text-sm text-on-surface-variant mt-3 max-w-2xl">
                        Track student reports, move each case through review, and keep learners informed when a topic issue is resolved.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchIssues}
                      className="px-5 py-3 rounded-lg border border-outline/20 bg-surface text-sm font-bold text-on-surface hover:bg-primary-container/5 transition-all"
                    >
                      Refresh Reports
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                    {ISSUE_FILTERS.map((filter) => {
                      const isSelected = issueStatusFilter === filter.value;
                      return (
                        <button
                          key={filter.value || 'all'}
                          type="button"
                          onClick={() => setIssueStatusFilter(filter.value)}
                          className={`rounded-lg border px-4 py-4 text-left transition-all ${
                            isSelected
                              ? 'bg-primary-container text-on-primary border-primary-container shadow-sm'
                              : 'bg-surface border-outline/10 text-on-surface hover:bg-primary-container/5'
                          }`}
                        >
                          <span className="block text-sm font-black">{filter.label}</span>
                          <span className={`block text-[10px] font-bold uppercase tracking-widest mt-1 ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                            {filter.helper}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-outline/10 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                      <h4 className="text-lg font-bold text-on-surface">Review Queue</h4>
                      <p className="text-xs text-on-surface-variant">
                        {issueStatusFilter ? `Showing ${issueStatusFilter.replace('-', ' ')} reports` : 'Showing all submitted reports'}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-primary-container/10 border border-primary-container/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-container">
                      {issues.length} {issues.length === 1 ? 'Report' : 'Reports'}
                    </span>
                  </div>

                  {issuesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-surface rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[65vh] overflow-auto pr-1">
                      {issues.map((issue) => (
                        <div key={issue._id} className="p-5 rounded-xl border border-outline/10 bg-surface hover:bg-card hover:shadow-sm transition-all">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="font-bold text-on-surface">{issue.title}</h5>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-widest ${issueStatusClassName[issue.issueStatus] || issueStatusClassName.open}`}>
                                  {issue.issueStatus === 'open' ? 'Submitted' : issue.issueStatus}
                                </span>
                              </div>
                              <p className="text-[11px] text-on-surface-variant mt-2 font-semibold">
                                {issue.topicId?.chapter?.subject?.subjectName || 'Subject'} / {issue.topicId?.chapter?.chapterName || 'Chapter'} / {issue.topicId?.topicName || 'Topic'}
                              </p>
                            </div>
                            <div className="rounded-lg bg-white border border-outline/10 px-4 py-3 text-xs text-on-surface-variant lg:min-w-[260px]">
                              <span className="block font-black uppercase tracking-widest text-[10px] text-primary-container mb-1">Student</span>
                              <span className="font-semibold text-on-surface">
                                {issue.studentId?.firstName || '-'} {issue.studentId?.lastName || ''}
                              </span>
                              <span className="block mt-1 break-all">{issue.studentId?.email || 'n/a'}</span>
                            </div>
                          </div>

                          <div className="mt-4 rounded-lg bg-white border border-outline/10 p-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Report Details</p>
                            <p className="text-sm text-on-surface-variant leading-6">{issue.issueDescription}</p>
                          </div>

                          {issue.response && (
                            <div className="mt-3 rounded-lg bg-primary-container/5 border border-primary-container/10 p-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary-container mb-2">Admin Response</p>
                              <p className="text-sm text-on-surface-variant leading-6">{issue.response}</p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => handleIssueStatusUpdate(issue, 'in-progress')}
                              className="text-xs font-bold px-4 py-2 rounded-lg border border-outline/20 bg-white text-on-surface hover:bg-primary-container/5 transition-all"
                            >
                              Mark In-progress
                            </button>
                            <button
                              type="button"
                              onClick={() => handleIssueStatusUpdate(issue, 'resolved')}
                              className="text-xs font-bold px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:opacity-90 transition-all"
                            >
                              Resolve Issue
                            </button>
                            <button
                              type="button"
                              onClick={() => handleIssueStatusUpdate(issue, 'closed')}
                              className="text-xs font-bold px-4 py-2 rounded-lg border border-outline/20 bg-white text-on-surface-variant hover:bg-surface transition-all"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      ))}
                      {!issuesLoading && issues.length === 0 && (
                        <div className="py-16 text-center bg-surface rounded-xl border border-dashed border-outline/20">
                          <TriangleAlert className="mx-auto text-on-surface-variant mb-3" size={28} />
                          <p className="font-bold text-on-surface">No reports found</p>
                          <p className="text-sm text-on-surface-variant mt-1">Try another status filter or refresh the queue.</p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </div>
            )}
            {activeSection === 'discussions' && <ManageDiscussionChannels />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
