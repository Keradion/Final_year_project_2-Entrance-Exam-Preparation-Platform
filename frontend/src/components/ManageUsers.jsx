import React, { useState } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, UserCheck, ShieldAlert, UserMinus, X, Mail, Phone, Calendar, Shield, MapPin, CircleUserRound, User, MoreHorizontal, MoreVertical } from 'lucide-react';

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
  const [selectedUser, setSelectedUser] = useState(null);
  
  const getRoleBadge = (role) => {
    const configs = {
      admin: "bg-primary-container/10 text-primary-container border-primary-container/20",
      teacher: "bg-secondary-container/10 text-secondary border-secondary/20",
      student: "bg-surface text-on-surface-variant border-outline/10"
    };
    const style = configs[role] || "bg-surface text-on-surface-variant border-outline/10";
    return (
      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${style}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'active';
    return (
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`}></div>
        <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-on-surface' : 'text-on-surface-variant/40'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3 py-6 sm:px-6 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative h-full flex flex-col min-w-0 w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6 min-w-0">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2 break-words">Users</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
          <div className="bg-white px-4 sm:px-8 py-4 rounded-xl border border-outline/10 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center min-w-0 shrink-0">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Users</span>
            <p className="text-2xl font-bold text-primary-container leading-none">{total}</p>
          </div>
          <button 
            onClick={fetchUsers}
            className="w-14 h-14 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:bg-primary-container/5 rounded-xl transition-all border border-outline/10 bg-white shadow-sm"
            title="Refresh Users"
          >
            <RefreshCw size={24} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter Suite */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="w-full bg-white border border-outline/20 rounded-lg pl-11 pr-4 py-3 sm:py-4 text-sm font-semibold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm min-h-11"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto min-w-0">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="w-full sm:min-w-[160px] bg-white border border-outline/20 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant focus:border-primary-container outline-none shadow-sm cursor-pointer appearance-none min-h-11"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full sm:min-w-[160px] bg-white border border-outline/20 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant focus:border-primary-container outline-none shadow-sm cursor-pointer appearance-none min-h-11"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* List (Responsive) */}
      <div className="flex-grow flex flex-col min-h-0">
        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] overflow-hidden flex-grow flex flex-col min-h-0">
          <div className="overflow-x-auto flex-grow">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface/50 border-b border-outline/5 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] sticky top-0 z-10">
                  <th className="px-8 py-5">User</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Account Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/5">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="group hover:bg-surface/50 transition-colors duration-200">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary-container/5 rounded-lg flex items-center justify-center text-primary-container font-bold text-sm group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300 border border-primary-container/10">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface leading-tight">{user.firstName} {user.lastName}</span>
                            <span className="text-[11px] font-medium text-on-surface-variant/60">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-8 py-5">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="p-2 rounded-lg text-on-surface-variant hover:text-primary-container hover:bg-primary-container/5 transition-all"
                            title="View Details"
                          >
                            <CircleUserRound size={18} />
                          </button>
                          <button 
                            disabled={updatingUserId === user._id}
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg transition-all ${user.status === 'active' ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {updatingUserId === user._id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              user.status === 'active' ? <UserMinus size={18} /> : <UserCheck size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <Search size={48} className="mb-4 text-outline" />
                        <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">No Users Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-container/5 rounded-lg flex items-center justify-center text-primary-container font-bold text-sm border border-primary-container/10">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface leading-tight">{user.firstName} {user.lastName}</span>
                      <span className="text-[10px] font-medium text-on-surface-variant/60">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 border-t border-outline/5">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="flex-grow py-2.5 rounded-lg bg-surface border border-outline/10 text-on-surface-variant font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface-variant transition-all"
                  >
                    <CircleUserRound size={16} />
                    View Profile
                  </button>
                  <button 
                    disabled={updatingUserId === user._id}
                    onClick={() => handleToggleStatus(user)}
                    className={`flex-grow py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      user.status === 'active' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                  >
                    {updatingUserId === user._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {user.status === 'active' ? <UserMinus size={16} /> : <UserCheck size={16} />}
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-outline-variant p-12 text-center">
              <div className="flex flex-col items-center opacity-40">
                <Search size={40} className="mb-4 text-outline" />
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">No Users Found</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline/10 bg-white text-on-surface-variant disabled:opacity-30 hover:bg-surface transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          {[...Array(pages)].map((_, i) => (
            <button 
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-lg font-bold text-xs transition-all ${page === i + 1 ? 'bg-primary-container text-on-primary shadow-md' : 'bg-white border border-outline/10 text-on-surface-variant hover:bg-surface'}`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={page === pages}
            onClick={() => setPage(prev => Math.min(pages, prev + 1))}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline/10 bg-white text-on-surface-variant disabled:opacity-30 hover:bg-surface transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* User Details Modal (Drawer) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedUser(null)}></div>
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-8 border-b border-outline/5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-on-surface tracking-tight">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-on-surface-variant hover:text-on-surface transition-colors p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 bg-primary-container/5 rounded-2xl flex items-center justify-center text-primary-container font-bold text-4xl mb-6 shadow-sm border border-primary-container/10">
                  {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                </div>
                <h4 className="text-2xl font-bold text-on-surface">{selectedUser.firstName} {selectedUser.lastName}</h4>
                <div className="flex gap-2 mt-4">
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-surface p-6 rounded-xl border border-outline/5">
                  <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Contact Information</label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-white border border-outline/10 flex items-center justify-center text-primary-container"><Mail size={18}/></div>
                       <div className="flex flex-col text-left">
                          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-1">Email Address</span>
                          <span className="text-sm font-bold text-on-surface">{selectedUser.email}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-white border border-outline/10 flex items-center justify-center text-primary-container"><Phone size={18}/></div>
                       <div className="flex flex-col text-left">
                          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-1">Phone Number</span>
                          <span className="text-sm font-bold text-on-surface">{selectedUser.phoneNumber || 'Not provided'}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface p-6 rounded-xl border border-outline/5">
                  <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Account Metadata</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Status</span>
                      {getStatusBadge(selectedUser.status)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Member Since</span>
                      <span className="text-sm font-bold text-on-surface">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-outline/5 bg-surface/30 flex flex-col gap-3">
              <button
                onClick={() => {
                  handleToggleStatus(selectedUser);
                  setSelectedUser(null);
                }}
                className={`w-full py-4 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all ${
                  selectedUser.status === 'active' 
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20' 
                  : 'bg-primary-container text-on-primary hover:brightness-110 shadow-primary-container/20'
                }`}
              >
                {selectedUser.status === 'active' ? <UserMinus size={18} /> : <UserCheck size={18} />}
                {selectedUser.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
