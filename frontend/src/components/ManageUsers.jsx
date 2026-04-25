import React from 'react';
import { Search, RefreshCw, User, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

const ManageUsers = ({
  users,
  query,
  setQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  pages,
  total,
  isLoading,
  error,
  successMessage,
  fetchUsers,
  handleToggleStatus,
  updatingUserId,
}) => {
  
  const getRoleBadge = (role) => {
    const configs = {
      admin: "bg-primary-container/10 text-primary-container border-primary-container/20",
      teacher: "bg-surface-variant/40 text-on-surface-variant border-outline/10",
      student: "bg-primary-container/5 text-primary-container border-primary-container/10"
    };
    const style = configs[role] || "bg-surface text-on-surface-variant border-outline/10";
    return (
      <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${style}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'active';
    return (
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary-container animate-pulse' : 'bg-outline/30'}`}></div>
        <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-on-surface' : 'text-on-surface-variant opacity-60'}`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-2 font-sans pb-20">
      {/* Enterprise Header */}
      <div className="flex items-center justify-between mb-12 border-b border-outline/5 pb-10">
        <div>
          <h1 className="text-4xl font-bold text-on-surface tracking-tight mb-1">Identity Governance</h1>
          <p className="text-on-surface-variant text-sm font-medium">Manage institutional accounts, access levels, and security status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-3 rounded-lg border border-outline/10 shadow-sm">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-0.5">Total Accounts</span>
            <p className="text-xl font-bold text-on-surface leading-none">{total}</p>
          </div>
          <button 
            onClick={fetchUsers}
            className="p-4 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/5 rounded-lg transition-all border border-transparent hover:border-primary-container/10"
          >
            <RefreshCw size={24} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Advanced Filter Suite */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-10">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-container transition-colors" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name or email address..."
            className="w-full bg-white border border-outline/10 rounded-lg pl-14 pr-8 py-5 text-sm font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm focus:shadow-md"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="bg-white border border-outline/10 rounded-lg px-8 py-5 text-xs font-bold uppercase tracking-wider text-on-surface-variant focus:border-primary-container outline-none shadow-sm cursor-pointer appearance-none hover:border-outline/30 transition-all"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Administrators</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-white border border-outline/10 rounded-lg px-8 py-5 text-xs font-bold uppercase tracking-wider text-on-surface-variant focus:border-primary-container outline-none shadow-sm cursor-pointer appearance-none hover:border-outline/30 transition-all"
        >
          <option value="">Status: All</option>
          <option value="active">Operational</option>
          <option value="inactive">Restricted</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Directory Content */}
      <div className="bg-white border border-outline/10 rounded-lg overflow-hidden shadow-sm">
        {error && (
          <div className="p-4 bg-error/10 text-error text-[10px] font-black uppercase tracking-widest text-center border-b border-error/20">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="p-4 bg-primary-container/10 text-primary-container text-[10px] font-black uppercase tracking-widest text-center border-b border-primary-container/20">
            {successMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-outline/5">
                <th className="px-8 py-5 text-left text-[10px] font-black text-on-surface-variant uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Access Level</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Security Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {users.map((user) => (
                <tr key={user._id} className="group hover:bg-surface/30 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-xs group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface leading-tight">{user.firstName} {user.lastName}</p>
                        <p className="text-[11px] font-medium text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {getStatusBadge(user.status)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      disabled={updatingUserId === user._id}
                      className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${user.status === 'active' ? 'text-error hover:bg-error/5' : 'text-primary-container hover:bg-primary-container/5'}`}
                    >
                      {updatingUserId === user._id ? 'Updating...' : user.status === 'active' ? 'Revoke Access' : 'Restore Access'}
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">No records match your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Professional Pagination */}
        <div className="px-8 py-6 bg-surface/30 border-t border-outline/5 flex items-center justify-between">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
            Page <span className="text-on-surface font-bold">{page}</span> of <span className="text-on-surface font-bold">{pages}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-md border border-outline/10 bg-white text-on-surface-variant hover:text-primary-container hover:border-primary-container/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-2 rounded-md border border-outline/10 bg-white text-on-surface-variant hover:text-primary-container hover:border-primary-container/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
