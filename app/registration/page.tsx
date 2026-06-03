'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  Search,
  Check,
  X,
  Clock,
  Loader2,
  Plus,
  Trash2,
  LogOut,
  Users,
  Phone,
} from 'lucide-react';

type ConfirmStatus = 'pending' | 'confirmed' | 'declined';

interface Guest {
  id: number;
  org: string;
  name: string;
  title: string;
  invited: boolean;
  confirmed: ConfirmStatus;
  phone: string;
  note: string;
  responsible: string;
}

interface GuestsFile {
  event: { title: string; subtitle: string; date: string; targetGuests: string };
  guests: Guest[];
}

const STORAGE_KEY = 'lhcb-reg-pass';

const STATUS_META: Record<ConfirmStatus, { label: string; cls: string; icon: typeof Check }> = {
  confirmed: { label: 'Баталгаажсан', cls: 'bg-emerald-100 text-emerald-700', icon: Check },
  declined: { label: 'Татгалзсан', cls: 'bg-rose-100 text-rose-700', icon: X },
  pending: { label: 'Хүлээгдэж буй', cls: 'bg-amber-100 text-amber-700', icon: Clock },
};

export default function RegistrationCheckerPage() {
  const [pass, setPass] = useState<string | null>(null);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [checking, setChecking] = useState(false);

  const [data, setData] = useState<GuestsFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  // Filters
  const [query, setQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');

  // Restore a previously entered password (within the browser session).
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setPass(saved);
  }, []);

  const loadGuests = useCallback(async (password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/guests', { headers: { 'x-admin-pass': password } });
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setPass(null);
        setAuthError('Нууц үг буруу байна.');
        return;
      }
      const json = (await res.json()) as GuestsFile;
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pass) loadGuests(pass);
  }, [pass, loadGuests]);

  const submitPass = async (e: FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setAuthError('');
    try {
      const res = await fetch('/api/guests', { headers: { 'x-admin-pass': passInput } });
      if (res.ok) {
        sessionStorage.setItem(STORAGE_KEY, passInput);
        setPass(passInput);
      } else {
        setAuthError('Нууц үг буруу байна.');
      }
    } catch {
      setAuthError('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setChecking(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPass(null);
    setData(null);
    setPassInput('');
  };

  const patchGuest = async (id: number, patch: Partial<Guest>) => {
    if (!pass) return;
    setSavingId(id);
    // Optimistic update
    setData((prev) =>
      prev
        ? { ...prev, guests: prev.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) }
        : prev
    );
    try {
      await fetch('/api/guests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-pass': pass },
        body: JSON.stringify({ id, ...patch }),
      });
    } finally {
      setSavingId(null);
    }
  };

  const addGuest = async () => {
    if (!pass) return;
    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-pass': pass },
      body: JSON.stringify({}),
    });
    if (res.ok) loadGuests(pass);
  };

  const deleteGuest = async (id: number) => {
    if (!pass) return;
    if (!window.confirm('Энэ зочныг устгах уу?')) return;
    const res = await fetch(`/api/guests?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-pass': pass },
    });
    if (res.ok) {
      setData((prev) =>
        prev ? { ...prev, guests: prev.guests.filter((g) => g.id !== id) } : prev
      );
    }
  };

  const guests = data?.guests ?? [];

  const orgs = useMemo(
    () => Array.from(new Set(guests.map((g) => g.org).filter(Boolean))).sort(),
    [guests]
  );
  const responsibles = useMemo(
    () => Array.from(new Set(guests.map((g) => g.responsible).filter(Boolean))).sort(),
    [guests]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter((g) => {
      if (orgFilter && g.org !== orgFilter) return false;
      if (statusFilter && g.confirmed !== statusFilter) return false;
      if (responsibleFilter && g.responsible !== responsibleFilter) return false;
      if (q) {
        const hay = `${g.name} ${g.org} ${g.title} ${g.phone} ${g.note} ${g.responsible}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [guests, query, orgFilter, statusFilter, responsibleFilter]);

  const stats = useMemo(() => {
    return {
      total: guests.length,
      confirmed: guests.filter((g) => g.confirmed === 'confirmed').length,
      declined: guests.filter((g) => g.confirmed === 'declined').length,
      pending: guests.filter((g) => g.confirmed === 'pending').length,
      withPhone: guests.filter((g) => g.phone.trim()).length,
    };
  }, [guests]);

  // ---- Password gate ----
  if (!pass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <form
          onSubmit={submitPass}
          className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-5">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-center text-lg font-bold text-slate-900">Зочдын бүртгэл</h1>
          <p className="text-center text-sm text-slate-500 mt-1 mb-6">
            Mongolia-CERN LHCb 2026 · Welcome dinner
          </p>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Нууц үг
          </label>
          <Input
            type="password"
            autoFocus
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="••••••••"
            className="h-11 mt-2 mb-3"
          />
          {authError && <p className="text-sm text-rose-600 mb-3">{authError}</p>}
          <Button type="submit" disabled={checking} className="w-full h-11" size="lg">
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Нэвтрэх'}
          </Button>
        </form>
      </div>
    );
  }

  // ---- Main checker ----
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              {data?.event.title ?? 'Зочдын бүртгэл'}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">{data?.event.subtitle}</p>
            <p className="text-xs text-slate-400 mt-1">
              Зорилтот зочдын тоо (Total Guests): {data?.event.targetGuests}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-3.5 w-3.5" />
            Гарах
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard icon={Users} label="Нийт" value={stats.total} cls="text-slate-900" />
          <StatCard icon={Check} label="Баталгаажсан" value={stats.confirmed} cls="text-emerald-600" />
          <StatCard icon={Clock} label="Хүлээгдэж буй" value={stats.pending} cls="text-amber-600" />
          <StatCard icon={X} label="Татгалзсан" value={stats.declined} cls="text-rose-600" />
          <StatCard icon={Phone} label="Утастай" value={stats.withPhone} cls="text-indigo-600" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Нэр, утас, тайлбараар хайх…"
              className="h-10 pl-9"
            />
          </div>
          <FilterSelect value={orgFilter} onChange={setOrgFilter} all="Бүх байгууллага" options={orgs} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-white px-3 text-sm text-slate-700"
          >
            <option value="">Бүх төлөв</option>
            <option value="confirmed">Баталгаажсан</option>
            <option value="pending">Хүлээгдэж буй</option>
            <option value="declined">Татгалзсан</option>
          </select>
          <FilterSelect
            value={responsibleFilter}
            onChange={setResponsibleFilter}
            all="Бүх хариуцагч"
            options={responsibles}
          />
          <Button size="sm" onClick={addGuest} className="h-10">
            <Plus className="h-4 w-4" />
            Зочин нэмэх
          </Button>
        </div>

        <p className="text-xs text-slate-400 mb-2">
          {filtered.length} / {guests.length} зочин харагдаж байна
        </p>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Уншиж байна…
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-3 px-3 w-10">#</th>
                  <th className="py-3 px-3">Байгууллага</th>
                  <th className="py-3 px-3">Зочны нэр</th>
                  <th className="py-3 px-3">Албан тушаал</th>
                  <th className="py-3 px-3 text-center">Урилга</th>
                  <th className="py-3 px-3">Төлөв</th>
                  <th className="py-3 px-3">Утас</th>
                  <th className="py-3 px-3">Хариуцагч</th>
                  <th className="py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => {
                  const meta = STATUS_META[g.confirmed];
                  return (
                    <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/60 align-top">
                      <td className="py-3 px-3 text-slate-400">{g.id}</td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{g.org || '—'}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {g.name || <span className="text-slate-300">—</span>}
                        {g.note && (
                          <div className="text-xs text-slate-400 font-normal mt-0.5">{g.note}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[260px]">{g.title || '—'}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => patchGuest(g.id, { invited: !g.invited })}
                          title="Урилга өгсөн эсэх"
                          className={`text-xs font-medium px-2 py-0.5 rounded-full transition ${
                            g.invited
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {g.invited ? 'Өгсөн' : '—'}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={g.confirmed}
                            onChange={(e) =>
                              patchGuest(g.id, { confirmed: e.target.value as ConfirmStatus })
                            }
                            className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${meta.cls}`}
                          >
                            <option value="pending">Хүлээгдэж буй</option>
                            <option value="confirmed">Баталгаажсан</option>
                            <option value="declined">Татгалзсан</option>
                          </select>
                          {savingId === g.id && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Input
                          defaultValue={g.phone}
                          onBlur={(e) => {
                            if (e.target.value !== g.phone) patchGuest(g.id, { phone: e.target.value });
                          }}
                          placeholder="Утас…"
                          inputMode="tel"
                          className="h-8 w-32"
                        />
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {g.responsible || '—'}
                      </td>
                      <td className="py-3 px-3">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteGuest(g.id)}
                          title="Устгах"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Зочин олдсонгүй.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-slate-300 mt-4">
          Энэ нь түр зуурын дотоод хуудас. Өөрчлөлтүүд автоматаар хадгалагдана.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  cls,
}: {
  icon: typeof Check;
  label: string;
  value: number;
  cls: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3">
      <Icon className={`h-5 w-5 ${cls}`} />
      <div>
        <div className={`text-xl font-bold leading-none ${cls}`}>{value}</div>
        <div className="text-xs text-slate-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  all,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  all: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-lg border border-input bg-white px-3 text-sm text-slate-700 max-w-[200px]"
    >
      <option value="">{all}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
