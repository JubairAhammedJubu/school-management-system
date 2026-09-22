"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { BookOpen, Plus, Loader2, Layers, Trash2, Sparkles } from "lucide-react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type Group = { id: string; name: string };

type SubjectRow = {
  id: string;
  name: string;
  code: string;
  isCore: boolean;
  group: Group | null;
};

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<"core" | "group">("core");
  const [groupId, setGroupId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [subjectsRes, groupsRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/subjects`, { credentials: "include" }),
        fetch(`${SERVER}/api/admin/academic-groups`, {
          credentials: "include",
        }),
      ]);
      const subjectsData = await subjectsRes.json();
      const groupsData = await groupsRes.json();

      if (!subjectsRes.ok)
        throw new Error(subjectsData.error || "Failed to load subjects");
      if (!groupsRes.ok)
        throw new Error(groupsData.error || "Failed to load groups");

      setSubjects(subjectsData.subjects || []);
      setGroups(groupsData.groups || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  const seedCurriculum = async () => {
    setSeeding(true);
    try {
      const res = await fetch(
        `${SERVER}/api/admin/subjects/seed-bd-curriculum`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      toast.success(data.message);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSeeding(false);
    }
  };
  const createSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    if (type === "group" && !groupId) {
      toast.error("Select a group for a group-specific subject");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${SERVER}/api/admin/subjects`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
          isCore: type === "core",
          groupId: type === "group" ? groupId : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create subject");

      toast.success("Subject added");
      setName("");
      setCode("");
      setGroupId("");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeSubject = async (id: string) => {
    try {
      const res = await fetch(`${SERVER}/api/admin/subjects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove subject");
      toast.success("Subject removed");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const coreSubjects = subjects.filter((s) => s.isCore);
  const groupSubjects = subjects.filter((s) => !s.isCore);

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
            <BookOpen className="h-5 w-5" />
          </span>
          Subjects
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Create the subject catalog here, then add subjects to specific class
          sections and assign teachers there.
        </p>
      </motion.div>

      {/* Create form */}
      <form
        onSubmit={createSubject}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md space-y-4 max-w-xl"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Subject name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mathematics"
              className="w-full mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="MATH"
              className="w-full mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Applies to
          </label>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => setType("core")}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold border transition-colors ${
                type === "core"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              Every student (core)
            </button>
            <button
              type="button"
              onClick={() => setType("group")}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold border transition-colors ${
                type === "group"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              Specific group only
            </button>
          </div>
        </div>

        {type === "group" && (
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Group
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/30"
              required
            >
              <option value="">Select group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {groups.length === 0 && (
              <p className="text-[11px] text-amber-600 mt-1">
                No groups found yet — add Academic Groups (Science, Business
                Studies, Humanities) first.
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Subject
        </button>
      </form>
      <button
        type="button"
        onClick={seedCurriculum}
        disabled={seeding}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 disabled:opacity-50"
      >
        {seeding ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        Seed BD Curriculum
      </button>
      {/* List */}
      {loading ? (
        <div className="p-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Core Subjects
              </h2>
              <p className="text-[11px] text-slate-500">
                Every student takes these
              </p>
            </div>
            {coreSubjects.length === 0 ? (
              <p className="px-5 py-6 text-xs text-slate-400 italic">
                No core subjects yet
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {coreSubjects.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {s.name}{" "}
                      <span className="text-slate-400 font-normal">
                        ({s.code})
                      </span>
                    </span>
                    <button
                      onClick={() => removeSubject(s.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-600" />
                Group Subjects
              </h2>
              <p className="text-[11px] text-slate-500">Class 9/10, by group</p>
            </div>
            {groupSubjects.length === 0 ? (
              <p className="px-5 py-6 text-xs text-slate-400 italic">
                No group-specific subjects yet
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {groupSubjects.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {s.name}{" "}
                      <span className="text-slate-400 font-normal">
                        ({s.code})
                      </span>
                      {s.group && (
                        <span className="ml-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/15 px-1.5 py-0.5 rounded">
                          {s.group.name}
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => removeSubject(s.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
