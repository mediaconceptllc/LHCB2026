'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Lock,
  Search,
  Check,
  X,
  Clock,
  Loader2,
  Plus,
  Minus,
  Trash2,
  Pencil,
  LogOut,
  Users,
  Phone,
  LayoutGrid,
} from 'lucide-react';

type ConfirmStatus = 'pending' | 'confirmed' | 'declined';
type GuestCategory = 'local' | 'honored';

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
  category?: GuestCategory;
  country?: string;
  addedBy?: string;
}

interface GuestsFile {
  event: { title: string; subtitle: string; date: string; targetGuests: string };
  guests: Guest[];
  seq?: number;
  seating?: Seating;
}

type GuestDraft = Omit<Guest, 'id'>;

const STORAGE_KEY = 'lhcb-reg-pass';
const SAVE_FAIL_MSG = 'Хадгалж чадсангүй. Дахин оролдоно уу.';

const EMPTY_DRAFT: GuestDraft = {
  org: '',
  name: '',
  title: '',
  invited: false,
  confirmed: 'pending',
  phone: '',
  note: '',
  responsible: '',
  category: 'local',
  country: '',
  addedBy: '',
};

const STATUS_META: Record<ConfirmStatus, { label: string; cls: string }> = {
  confirmed: { label: 'Баталгаажсан', cls: 'bg-emerald-100 text-emerald-700' },
  declined: { label: 'Татгалзсан', cls: 'bg-rose-100 text-rose-700' },
  pending: { label: 'Хүлээгдэж буй', cls: 'bg-amber-100 text-amber-700' },
};

type Seating = Record<string, (number | null)[]>;

// Table positions (% of the canvas). #1 is the centre; the rest fan out
// clockwise — i.e. numbered from the centre outward.
const TABLES: { id: number; x: number; y: number }[] = [
  { id: 1, x: 49, y: 27 }, // centre-top
  { id: 2, x: 18, y: 15 }, // top-left
  { id: 3, x: 80, y: 14 }, // top-right
  { id: 4, x: 82, y: 47 }, // mid-right
  { id: 5, x: 67, y: 86 }, // bottom-right
  { id: 6, x: 31, y: 86 }, // bottom-left
  { id: 7, x: 18, y: 47 }, // mid-left
  { id: 8, x: 49, y: 60 }, // centre
];
const DEFAULT_SEATS = 8;

function buildSeating(s?: Seating): Seating {
  const out: Seating = {};
  for (const t of TABLES) {
    const arr = s?.[String(t.id)];
    out[String(t.id)] = Array.isArray(arr) ? arr.slice() : Array(DEFAULT_SEATS).fill(null);
  }
  if (s) for (const k of Object.keys(s)) if (!(k in out)) out[k] = s[k].slice();
  return out;
}

function shortName(name: string): string {
  const n = name.trim();
  return n.length > 9 ? n.slice(0, 8) + '…' : n;
}

export default function RegistrationCheckerPage() {
  const [pass, setPass] = useState<string | null>(null);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [checking, setChecking] = useState(false);

  const [data, setData] = useState<GuestsFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Modal: 'new' to add, a Guest to edit, or null when closed.
  const [editing, setEditing] = useState<Guest | 'new' | null>(null);
  const [savingModal, setSavingModal] = useState(false);
  // Inline delete confirmation (avoids window.confirm, which some webviews block).
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Tabs / filters
  const [tab, setTab] = useState<'local' | 'honored' | 'seating'>('local');
  const categoryTab: GuestCategory = tab === 'honored' ? 'honored' : 'local';
  const isSeating = tab === 'seating';
  const [seatingSaving, setSeatingSaving] = useState(false);
  const [picking, setPicking] = useState<{ tableId: number; seatIdx: number } | null>(null);
  const [query, setQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');

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

  // Quick inline edit (phone / status / invited toggle) with optimistic update.
  const patchGuest = async (id: number, patch: Partial<Guest>) => {
    if (!pass) return;
    setSavingId(id);
    setError('');
    const prevGuest = data?.guests.find((g) => g.id === id);
    setData((prev) =>
      prev
        ? { ...prev, guests: prev.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) }
        : prev
    );
    try {
      const res = await fetch('/api/guests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-pass': pass },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      if (prevGuest) {
        setData((prev) =>
          prev
            ? { ...prev, guests: prev.guests.map((g) => (g.id === id ? prevGuest : g)) }
            : prev
        );
      }
      setError(SAVE_FAIL_MSG);
    } finally {
      setSavingId(null);
    }
  };

  // Save the Add/Edit modal (full record).
  const saveModal = async (draft: GuestDraft) => {
    if (!pass) return;
    setSavingModal(true);
    setError('');
    try {
      const isNew = editing === 'new';
      const res = await fetch('/api/guests', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-pass': pass },
        body: JSON.stringify(isNew ? draft : { id: (editing as Guest).id, ...draft }),
      });
      if (!res.ok) throw new Error(String(res.status));
      await loadGuests(pass);
      setEditing(null);
    } catch {
      setError(SAVE_FAIL_MSG);
    } finally {
      setSavingModal(false);
    }
  };

  const performDelete = async (id: number) => {
    if (!pass) return;
    setDeleteBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/guests?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pass': pass },
      });
      if (!res.ok) throw new Error(String(res.status));
      setData((prev) =>
        prev ? { ...prev, guests: prev.guests.filter((g) => g.id !== id) } : prev
      );
      setDeletingId(null);
    } catch {
      setError(SAVE_FAIL_MSG);
    } finally {
      setDeleteBusy(false);
    }
  };

  const guests = data?.guests ?? [];
  const catOf = (g: Guest): GuestCategory => (g.category === 'honored' ? 'honored' : 'local');

  const counts = useMemo(
    () => ({
      local: guests.filter((g) => catOf(g) === 'local').length,
      honored: guests.filter((g) => catOf(g) === 'honored').length,
    }),
    [guests]
  );

  // Guests in the active tab (before search/dropdown filters).
  const categoryGuests = useMemo(
    () => guests.filter((g) => catOf(g) === categoryTab),
    [guests, categoryTab]
  );

  const orgs = useMemo(
    () => Array.from(new Set(categoryGuests.map((g) => g.org).filter(Boolean))).sort(),
    [categoryGuests]
  );
  const responsibles = useMemo(
    () => Array.from(new Set(categoryGuests.map((g) => g.responsible).filter(Boolean))).sort(),
    [categoryGuests]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categoryGuests.filter((g) => {
      if (orgFilter && g.org !== orgFilter) return false;
      if (statusFilter && g.confirmed !== statusFilter) return false;
      if (responsibleFilter && g.responsible !== responsibleFilter) return false;
      if (q) {
        const hay = `${g.name} ${g.org} ${g.title} ${g.phone} ${g.note} ${g.responsible} ${g.country ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [categoryGuests, query, orgFilter, statusFilter, responsibleFilter]);

  const stats = useMemo(
    () => ({
      total: categoryGuests.length,
      confirmed: categoryGuests.filter((g) => g.confirmed === 'confirmed').length,
      declined: categoryGuests.filter((g) => g.confirmed === 'declined').length,
      pending: categoryGuests.filter((g) => g.confirmed === 'pending').length,
      withPhone: categoryGuests.filter((g) => g.phone.trim()).length,
    }),
    [categoryGuests]
  );

  const isHonored = categoryTab === 'honored';

  // ---- Seating ----
  const guestsById = useMemo(() => {
    const m = new Map<number, Guest>();
    guests.forEach((g) => m.set(g.id, g));
    return m;
  }, [guests]);

  const seating = useMemo(() => buildSeating(data?.seating), [data?.seating]);

  const seatedIds = useMemo(() => {
    const set = new Set<number>();
    Object.values(seating).forEach((arr) =>
      arr.forEach((gid) => {
        if (gid != null) set.add(gid);
      })
    );
    return set;
  }, [seating]);

  const seatStats = useMemo(() => {
    const totalSeats = Object.values(seating).reduce((n, a) => n + a.length, 0);
    return { totalSeats, seated: seatedIds.size, unseated: guests.length - seatedIds.size };
  }, [seating, seatedIds, guests.length]);

  const cloneSeating = (): Seating => {
    const next: Seating = {};
    for (const k of Object.keys(seating)) next[k] = seating[k].slice();
    return next;
  };

  const saveSeating = async (next: Seating) => {
    if (!pass) return;
    const prev = data?.seating;
    setData((d) => (d ? { ...d, seating: next } : d));
    setSeatingSaving(true);
    setError('');
    try {
      const res = await fetch('/api/seating', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-pass': pass },
        body: JSON.stringify({ seating: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setData((d) => (d ? { ...d, seating: prev } : d));
      setError(SAVE_FAIL_MSG);
    } finally {
      setSeatingSaving(false);
    }
  };

  const assignSeat = (tableId: number, seatIdx: number, guestId: number | null) => {
    const next = cloneSeating();
    // A guest can only sit in one seat — remove them from any other seat first.
    if (guestId != null) {
      for (const k of Object.keys(next)) next[k] = next[k].map((g) => (g === guestId ? null : g));
    }
    const key = String(tableId);
    if (!next[key]) next[key] = Array(DEFAULT_SEATS).fill(null);
    next[key][seatIdx] = guestId;
    saveSeating(next);
  };

  const addSeat = (tableId: number) => {
    const next = cloneSeating();
    const key = String(tableId);
    next[key] = [...(next[key] ?? []), null];
    saveSeating(next);
  };

  const removeSeat = (tableId: number) => {
    const next = cloneSeating();
    const key = String(tableId);
    const arr = next[key] ?? [];
    if (arr.length <= 1) return;
    arr.pop(); // drop the last seat (frees its occupant if any)
    next[key] = arr;
    saveSeating(next);
  };

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

        {/* Tabs */}
        <div className="flex gap-2 mb-5 border-b border-slate-200 overflow-x-auto">
          <TabButton active={tab === 'local'} onClick={() => setTab('local')} label="Зочид" count={counts.local} />
          <TabButton
            active={tab === 'honored'}
            onClick={() => setTab('honored')}
            label="Хүндэт зочид"
            count={counts.honored}
          />
          <TabButton
            active={tab === 'seating'}
            onClick={() => setTab('seating')}
            label="Ширээний хуваарь"
            count={seatStats.seated}
          />
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {!isSeating && (
        <>
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
          <Button size="sm" onClick={() => setEditing('new')} className="h-10">
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
                  <th className="py-3 px-3 text-center w-12">Улс</th>
                  <th className="py-3 px-3">Байгууллага</th>
                  <th className="py-3 px-3">Зочны нэр</th>
                  <th className="py-3 px-3">{isHonored ? 'Чиглэл' : 'Албан тушаал'}</th>
                  <th className="py-3 px-3 text-center">Урилга</th>
                  <th className="py-3 px-3">Төлөв</th>
                  <th className="py-3 px-3">Утас</th>
                  <th className="py-3 px-3">Хариуцагч</th>
                  <th className="py-3 px-3 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, idx) => {
                  const meta = STATUS_META[g.confirmed];
                  return (
                    <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/60 align-top">
                      <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 text-center text-lg leading-none">{g.country || ''}</td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{g.org || '—'}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {g.name || <span className="text-slate-300">— нэр алга —</span>}
                        {g.note && (
                          <div className="text-xs text-slate-400 font-normal mt-0.5">{g.note}</div>
                        )}
                        {g.addedBy && (
                          <div className="text-xs text-slate-400 font-normal mt-0.5">
                            Бүртгэсэн: {g.addedBy}
                          </div>
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
                          key={`${g.id}-${g.phone}`}
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
                        {deletingId === g.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs text-rose-600 mr-1">Устгах уу?</span>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              disabled={deleteBusy}
                              onClick={() => performDelete(g.id)}
                              title="Тийм, устга"
                            >
                              {deleteBusy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled={deleteBusy}
                              onClick={() => setDeletingId(null)}
                              title="Болих"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setEditing(g)}
                              title="Засах"
                            >
                              <Pencil className="h-3.5 w-3.5 text-slate-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setDeletingId(g.id)}
                              title="Устгах"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      Зочин олдсонгүй.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        </>
        )}

        {isSeating && (
          <SeatingView
            seating={seating}
            guestsById={guestsById}
            seatStats={seatStats}
            saving={seatingSaving}
            onSeatClick={(tableId, seatIdx) => setPicking({ tableId, seatIdx })}
            onAddSeat={addSeat}
            onRemoveSeat={removeSeat}
          />
        )}

        <p className="text-xs text-slate-300 mt-4">
          Энэ нь түр зуурын дотоод хуудас. Өөрчлөлтүүд автоматаар хадгалагдана.
        </p>
      </div>

      {editing !== null && (
        <GuestModal
          initial={editing === 'new' ? { ...EMPTY_DRAFT, category: categoryTab } : editing}
          isNew={editing === 'new'}
          saving={savingModal}
          onCancel={() => setEditing(null)}
          onSave={saveModal}
        />
      )}

      {picking && (
        <SeatPicker
          tableId={picking.tableId}
          seatIdx={picking.seatIdx}
          current={seating[String(picking.tableId)]?.[picking.seatIdx] ?? null}
          guests={guests}
          guestsById={guestsById}
          seatedIds={seatedIds}
          onClose={() => setPicking(null)}
          onAssign={(gid) => {
            assignSeat(picking.tableId, picking.seatIdx, gid);
            setPicking(null);
          }}
        />
      )}
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

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative -mb-px px-4 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? 'text-slate-900 border-b-2 border-slate-900'
          : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
      }`}
    >
      {label}
      <span
        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
          active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {count}
      </span>
    </button>
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

function GuestModal({
  initial,
  isNew,
  saving,
  onCancel,
  onSave,
}: {
  initial: GuestDraft;
  isNew: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: (draft: GuestDraft) => void;
}) {
  const [form, setForm] = useState<GuestDraft>({
    org: initial.org,
    name: initial.name,
    title: initial.title,
    invited: initial.invited,
    confirmed: initial.confirmed,
    phone: initial.phone,
    note: initial.note,
    responsible: initial.responsible,
    category: initial.category ?? 'local',
    country: initial.country ?? '',
    addedBy: initial.addedBy ?? '',
  });

  const set = <K extends keyof GuestDraft>(key: K, value: GuestDraft[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addedByMissing = isNew && !(form.addedBy ?? '').trim();
  const canSave = form.name.trim() && !addedByMissing;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onCancel}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            {isNew ? 'Шинэ зочин бүртгэх' : 'Зочны мэдээлэл засах'}
          </h2>
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Ангилал">
            <select
              value={form.category ?? 'local'}
              onChange={(e) => set('category', e.target.value as GuestCategory)}
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-slate-700"
            >
              <option value="local">Зочид</option>
              <option value="honored">Хүндэт зочид</option>
            </select>
          </Field>
          <Field label="Улс (туг)">
            <Input
              value={form.country ?? ''}
              onChange={(e) => set('country', e.target.value)}
              placeholder="🇲🇳"
              className="h-10"
            />
          </Field>
          <Field label="Зочны нэр *" className="sm:col-span-2">
            <Input value={form.name} autoFocus onChange={(e) => set('name', e.target.value)} className="h-10" />
          </Field>
          <Field label="Байгууллага">
            <Input value={form.org} onChange={(e) => set('org', e.target.value)} className="h-10" />
          </Field>
          <Field label={(form.category ?? 'local') === 'honored' ? 'Чиглэл' : 'Албан тушаал'}>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} className="h-10" />
          </Field>
          <Field label="Утас">
            <Input
              value={form.phone}
              inputMode="tel"
              onChange={(e) => set('phone', e.target.value)}
              className="h-10"
            />
          </Field>
          <Field label="Хариуцагч">
            <Input
              value={form.responsible}
              onChange={(e) => set('responsible', e.target.value)}
              className="h-10"
            />
          </Field>
          <Field label={`Бүртгэсэн хүн${isNew ? ' *' : ''}`}>
            <Input
              value={form.addedBy ?? ''}
              onChange={(e) => set('addedBy', e.target.value)}
              placeholder="Хэн нэмж байна?"
              aria-invalid={addedByMissing}
              className="h-10"
            />
          </Field>
          <Field label="Төлөв">
            <select
              value={form.confirmed}
              onChange={(e) => set('confirmed', e.target.value as ConfirmStatus)}
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-slate-700"
            >
              <option value="pending">Хүлээгдэж буй</option>
              <option value="confirmed">Баталгаажсан</option>
              <option value="declined">Татгалзсан</option>
            </select>
          </Field>
          <Field label="Урилга">
            <label className="flex h-10 items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.invited}
                onChange={(e) => set('invited', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Урилга өгсөн
            </label>
          </Field>
          <Field label="Тайлбар" className="sm:col-span-2">
            <Input value={form.note} onChange={(e) => set('note', e.target.value)} className="h-10" />
          </Field>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Болих
          </Button>
          <Button type="submit" disabled={saving || !canSave}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isNew ? 'Бүртгэх' : 'Хадгалах'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function SeatingView({
  seating,
  guestsById,
  seatStats,
  saving,
  onSeatClick,
  onAddSeat,
  onRemoveSeat,
}: {
  seating: Seating;
  guestsById: Map<number, Guest>;
  seatStats: { totalSeats: number; seated: number; unseated: number };
  saving: boolean;
  onSeatClick: (tableId: number, seatIdx: number) => void;
  onAddSeat: (tableId: number) => void;
  onRemoveSeat: (tableId: number) => void;
}) {
  const R = 78; // seat ring radius (px)

  return (
    <div>
      {/* Legend / summary */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-slate-400" />
          {TABLES.length} ширээ · {seatStats.totalSeats} суудал
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-sky-500" /> Суусан: {seatStats.seated}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded border border-dashed border-slate-300" /> Хоосон
        </span>
        <span className="text-slate-400">Суудалгүй зочид: {seatStats.unseated}</span>
        {saving && (
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Хадгалж байна…
          </span>
        )}
      </div>

      {/* Visual plan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="relative mx-auto h-[720px] min-w-[720px] max-w-[920px]">
          {TABLES.map((t) => {
            const seats = seating[String(t.id)] ?? [];
            const n = Math.max(seats.length, 1);
            return (
              <div
                key={t.id}
                className="absolute"
                style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {/* Table */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-sky-300 text-base font-bold text-slate-800 shadow">
                  {t.id}
                </div>
                {/* Seats */}
                {seats.map((gid, i) => {
                  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
                  const sx = Math.cos(ang) * R;
                  const sy = Math.sin(ang) * R;
                  const guest = gid != null ? guestsById.get(gid) : undefined;
                  return (
                    <button
                      key={i}
                      onClick={() => onSeatClick(t.id, i)}
                      title={
                        guest
                          ? `${guest.name}${guest.org ? ' — ' + guest.org : ''}`
                          : `Суудал ${i + 1} (хоосон)`
                      }
                      className={`absolute flex items-center justify-center overflow-hidden text-[10px] font-medium transition ${
                        guest
                          ? 'h-6 min-w-[46px] max-w-[60px] rounded-md bg-sky-500 px-1 text-white hover:bg-sky-600'
                          : 'h-6 w-6 rounded-md border border-dashed border-slate-300 text-slate-400 hover:border-sky-400 hover:text-sky-500'
                      }`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) translate(${sx}px, ${sy}px)`,
                      }}
                    >
                      {guest ? shortName(guest.name) : i + 1}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Roster + seat controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {TABLES.map((t) => {
          const seats = seating[String(t.id)] ?? [];
          const occupied = seats.filter((g) => g != null && guestsById.has(g)).length;
          return (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900">
                  Ширээ {t.id}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({occupied}/{seats.length})
                  </span>
                </h3>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => onRemoveSeat(t.id)} title="Суудал хасах">
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs text-slate-400 w-4 text-center">{seats.length}</span>
                  <Button variant="ghost" size="icon-sm" onClick={() => onAddSeat(t.id)} title="Суудал нэмэх">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <ol className="space-y-1">
                {seats.map((gid, i) => {
                  const guest = gid != null ? guestsById.get(gid) : undefined;
                  return (
                    <li key={i}>
                      <button
                        onClick={() => onSeatClick(t.id, i)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50"
                      >
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                          {i + 1}
                        </span>
                        {guest ? (
                          <span className="flex-1 truncate text-slate-800">
                            {guest.country ? guest.country + ' ' : ''}
                            {guest.name}
                            {guest.org ? <span className="text-slate-400"> · {guest.org}</span> : ''}
                          </span>
                        ) : (
                          <span className="flex-1 text-slate-300">— хоосон —</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeatPicker({
  tableId,
  seatIdx,
  current,
  guests,
  guestsById,
  seatedIds,
  onClose,
  onAssign,
}: {
  tableId: number;
  seatIdx: number;
  current: number | null;
  guests: Guest[];
  guestsById: Map<number, Guest>;
  seatedIds: Set<number>;
  onClose: () => void;
  onAssign: (guestId: number | null) => void;
}) {
  const [q, setQ] = useState('');
  const currentGuest = current != null ? guestsById.get(current) : undefined;

  const candidates = useMemo(() => {
    const query = q.trim().toLowerCase();
    return guests
      .filter((g) => !seatedIds.has(g.id) || g.id === current)
      .filter((g) => {
        if (!query) return true;
        return `${g.name} ${g.org} ${g.title} ${g.country ?? ''}`.toLowerCase().includes(query);
      });
  }, [guests, seatedIds, current, q]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-5 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">
            Ширээ {tableId} · Суудал {seatIdx + 1}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {currentGuest && (
          <div className="mb-3 flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2 text-sm">
            <span className="text-slate-700">
              Одоо: <b>{currentGuest.name}</b>
            </span>
            <Button variant="destructive" size="sm" onClick={() => onAssign(null)}>
              Хоослох
            </Button>
          </div>
        )}

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={q}
            autoFocus
            onChange={(e) => setQ(e.target.value)}
            placeholder="Зочин хайх…"
            className="h-10 pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          {candidates.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Сул зочин алга.</p>
          ) : (
            <ul className="space-y-1">
              {candidates.map((g) => (
                <li key={g.id}>
                  <button
                    onClick={() => onAssign(g.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      g.id === current ? 'bg-sky-50' : ''
                    }`}
                  >
                    <span className="flex-1 truncate text-slate-800">
                      {g.country ? g.country + ' ' : ''}
                      {g.name}
                      {g.org ? <span className="text-slate-400"> · {g.org}</span> : ''}
                    </span>
                    {g.category === 'honored' && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">
                        Хүндэт
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
