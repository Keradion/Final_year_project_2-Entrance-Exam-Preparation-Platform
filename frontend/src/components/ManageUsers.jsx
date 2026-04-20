import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

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
  statusClassName,
}) => (
  <div className="mx-auto w-full max-w-6xl space-y-5">
    <div className="rounded-2xl border border-[#e3e6ea] bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-black text-[#202124]">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-[#5f6368]">Search student and teacher accounts and activate/deactivate access.</p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5f6368]" htmlFor="query">Search</label>
          <div className="relative">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Name or email"
              className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 pr-10 text-[#202124] placeholder:text-[#7a8088] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8088]" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5f6368]" htmlFor="roleFilter">Role</label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
          >
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5f6368]" htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="block w-full rounded-lg border border-[#d6dbe1] bg-white px-3 py-2.5 text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 rounded-lg border border-[#1a73e8] bg-[#1a73e8] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1765cc]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
    </div>
    <div className="rounded-2xl border border-[#e3e6ea] bg-white p-4 shadow-sm sm:p-6">
      {error && (
        <div className="mb-4 rounded-lg border border-[#d41929]/30 bg-[#feecee] px-4 py-3 text-sm font-semibold text-[#d41929]">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-lg border border-[#0f9d58]/30 bg-[#e8f5ee] px-4 py-3 text-sm font-semibold text-[#0f9d58]">
          {successMessage}
        </div>
      )}
      {isLoading ? (
        <p className="py-8 text-center text-sm font-semibold text-[#5f6368]">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="py-8 text-center text-sm font-semibold text-[#5f6368]">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-[#eceff3] text-left text-xs font-bold uppercase tracking-wide text-[#5f6368]">
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const statusClass = statusClassName[user.status] || statusClassName.inactive;
                const isUpdating = updatingUserId === user._id;
                return (
                  <tr key={user._id} className="border-b border-[#f1f3f6] text-sm text-[#202124]">
                    <td className="px-3 py-3 font-semibold">{user.firstName} {user.lastName}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3 capitalize">{user.role}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusClass}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        disabled={isUpdating}
                        className="rounded-lg border border-black px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdating
                          ? 'Saving...'
                          : user.status === 'active'
                            ? 'Deactivate'
                            : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-[#eceff3] pt-4 text-sm text-[#5f6368] sm:flex-row sm:items-center">
            <p className="font-semibold">
              Page {page} of {pages} • {total} user{total === 1 ? '' : 's'}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-[#d6dbe1] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#202124] transition-colors hover:bg-[#f1f3f6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="rounded-lg border border-[#d6dbe1] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#202124] transition-colors hover:bg-[#f1f3f6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ManageUsers;
