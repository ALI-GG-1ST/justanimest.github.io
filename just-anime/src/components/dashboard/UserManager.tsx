/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, UserPlus, Trash2, Edit3, CheckCircle2, X } from 'lucide-react';

interface UserManagerProps {
  lang: 'ar' | 'en';
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  joinDate: string;
  status: 'active' | 'suspended';
}

export default function UserManager({ lang }: UserManagerProps) {
  const isAr = lang === 'ar';
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  // User Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'user'>('user');

  const defaultUsersList: UserRecord[] = [
    { id: 'user-1', name: 'علاء عباس', email: 'alawyabbas15@gmail.com', role: 'admin', joinDate: '2026-01-10', status: 'active' },
    { id: 'user-2', name: 'سارة أحمد', email: 'sara.ahmed@example.com', role: 'editor', joinDate: '2026-02-14', status: 'active' },
    { id: 'user-3', name: 'خالد اليوسف', email: 'khaled.y@example.com', role: 'editor', joinDate: '2026-03-20', status: 'active' },
    { id: 'user-4', name: 'محمد الأوتاكو', email: 'otaku.moe@example.com', role: 'user', joinDate: '2026-04-05', status: 'active' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('just_anime_users_all');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      setUsers(defaultUsersList);
      localStorage.setItem('just_anime_users_all', JSON.stringify(defaultUsersList));
    }
  }, []);

  const saveToStorage = (updated: UserRecord[]) => {
    setUsers(updated);
    localStorage.setItem('just_anime_users_all', JSON.stringify(updated));
  };

  const handleRoleChange = (id: string, newRole: 'admin' | 'editor' | 'user') => {
    const updated = users.map((u) => (u.id === id ? { ...u, role: newRole } : u));
    saveToStorage(updated);
    setSuccessMsg(isAr ? 'تم تحديث صلاحية وأدوار المستخدم بنجاح!' : 'User permission and role updated!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleToggleStatus = (id: string) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? ('suspended' as const) : ('active' as const);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveToStorage(updated);
    setSuccessMsg(isAr ? 'تم تغيير حالة الحساب بنجاح!' : 'User account status changed!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleDeleteUser = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا العضو بالكامل؟' : 'Are you sure you want to delete this user profile?')) return;
    const updated = users.filter((u) => u.id !== id);
    saveToStorage(updated);
    setSuccessMsg(isAr ? 'تم حذف المستخدم من النظام.' : 'User profile deleted.');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleTriggerEdit = (user: UserRecord) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setFormOpen(true);
  };

  const handleAddUserSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    let updated: UserRecord[] = [];
    if (editId) {
      updated = users.map((u) => 
        u.id === editId ? { ...u, name, email, role } : u
      );
      setSuccessMsg(isAr ? 'تم تعديل بيانات العضو بنجاح!' : 'User profile updated successfully!');
    } else {
      const entry: UserRecord = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      updated = [...users, entry];
      setSuccessMsg(isAr ? 'تم تسجيل وإضافة المستخدم الجديد للموقع بنجاح!' : 'New user successfully registered!');
    }

    saveToStorage(updated);
    resetForm();
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('user');
    setEditId(null);
    setFormOpen(false);
  };

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]" id="user-manager-component">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-4">
        <div>
          <h3 className="font-sans font-black text-xl text-black flex items-center gap-2 uppercase tracking-wide">
            <Users className="w-6 h-6 text-black" />
            <span>{isAr ? 'صلاحيات وأعضاء الموقع' : 'Users & Permissions Control'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            {isAr 
              ? `تدير حالياً صلاحيات لـ ${users.length} عضو مسجل بالفريق والموقع` 
              : `Currently managing details for ${users.length} registered members`}
          </p>
        </div>

        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white font-sans text-xs font-black uppercase tracking-widest px-6 py-3 border-2 border-black rounded-none flex items-center justify-center gap-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(245,158,11,1)] cursor-pointer"
          >
            <UserPlus className="w-4.5 h-4.5 text-white" />
            <span>{isAr ? 'إضافة مستخدم جديد' : 'Register New User'}</span>
          </button>
        )}
      </div>

      {/* Success Notifications popup */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-black text-white border-2 border-red-500 p-4 rounded-none mb-6 flex items-center gap-2.5 font-sans font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REGISTER / EDIT USER FORM */}
      {formOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border-2 border-black bg-neutral-50 rounded-none mb-6"
          id="user-register-form-box"
        >
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
            <h4 className="font-sans font-black text-sm text-black">
              {editId ? (isAr ? 'تعديل بيانات عضو بالفريق' : 'Edit Team Member Details') : (isAr ? 'تسجيل عضو فريق جديد بالمدونة' : 'Register New Team Member')}
            </h4>
            <button
              onClick={resetForm}
              className="p-1 border border-black rounded-none hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-4.5 h-4.5 text-black" />
            </button>
          </div>

          <form onSubmit={handleAddUserSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold font-sans text-black">
            <div className={isAr ? 'text-right' : 'text-left'}>
              <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
              <input
                type="text"
                required
                placeholder={isAr ? 'مثال: أحمد الحربي...' : 'e.g. Ahmed Al-Harbi'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
              />
            </div>

            <div className={isAr ? 'text-right' : 'text-left'}>
              <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
              />
            </div>

            <div className={isAr ? 'text-right' : 'text-left'}>
              <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'الصلاحية والوظيفة' : 'System Role'}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'editor' | 'user')}
                className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none font-black cursor-pointer"
              >
                <option value="user">{isAr ? 'عضو عادي (User)' : 'User'}</option>
                <option value="editor">{isAr ? 'محرر وكاتب (Editor)' : 'Editor'}</option>
                <option value="admin">{isAr ? 'مدير مسؤول (Administrator)' : 'Admin'}</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-3 border-t border-neutral-200 pt-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-white text-black border border-black rounded-none text-xs font-bold cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-black hover:bg-neutral-800 text-white border border-black rounded-none text-xs font-black uppercase cursor-pointer"
              >
                {editId ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'تسجيل العضو' : 'Register Member')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* FILTER SEARCH PANEL */}
      {!formOpen && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder={isAr ? 'بحث سريع عن أعضاء الموقع بالاسم أو البريد...' : 'Search members by name or email...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 hover:bg-neutral-100/50 border-2 border-black rounded-none text-xs px-10 py-3.5 focus:outline-none focus:bg-white font-sans font-bold text-black"
            />
            <Search className={`absolute top-4.5 w-4.5 h-4.5 text-black ${isAr ? 'right-3.5' : 'left-3.5'}`} />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto border-2 border-black rounded-none" id="users-table-container">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-black text-white text-[10px] sm:text-xs font-black uppercase border-b-2 border-black font-sans">
                  <th className={`p-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'المستخدم' : 'Full Name'}</th>
                  <th className={`p-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className={`p-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الدور والوظيفة' : 'System Role'}</th>
                  <th className={`p-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'تاريخ الانضمام' : 'Join Date'}</th>
                  <th className="p-3.5 text-center">{isAr ? 'الحالة والتحكم' : 'Status & Control'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors text-xs" id={`user-row-${user.id}`}>
                    {/* Name + Avatar placeholder */}
                    <td className="p-3.5 font-sans font-black text-black">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-amber-400 text-black border border-black rounded-none flex items-center justify-center font-bold text-xs uppercase">
                          {user.name.slice(0, 2)}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-3.5 font-mono font-semibold text-neutral-500">
                      {user.email}
                    </td>

                    {/* Role update option */}
                    <td className="p-3.5">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'editor' | 'user')}
                        className="bg-white border border-black rounded-none px-2 py-1 text-[10px] font-black cursor-pointer"
                      >
                        <option value="user">{isAr ? 'عضو عادي' : 'User'}</option>
                        <option value="editor">{isAr ? 'محرر' : 'Editor'}</option>
                        <option value="admin">{isAr ? 'مدير مسؤول' : 'Admin'}</option>
                      </select>
                    </td>

                    {/* Join Date */}
                    <td className="p-3.5 font-mono text-neutral-500 font-bold">
                      {user.joinDate}
                    </td>

                    {/* Action toggles: Active/Suspend, Edit & Delete */}
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-2 py-1 border border-black rounded-none text-[9px] font-black uppercase cursor-pointer ${
                            user.status === 'active' 
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' 
                              : 'bg-red-50 hover:bg-red-100 text-red-700'
                          }`}
                        >
                          {user.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'موقوف' : 'Suspended')}
                        </button>
                        <button
                          onClick={() => handleTriggerEdit(user)}
                          className="p-1 border border-black hover:bg-neutral-100 rounded-none text-black cursor-pointer shadow-xs"
                          title={isAr ? 'تعديل بيانات العضو' : 'Edit Member'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 border border-black hover:bg-red-50 hover:text-red-600 hover:border-red-600 rounded-none text-neutral-600 cursor-pointer shadow-xs"
                          title={isAr ? 'حذف العضو' : 'Delete Member'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
