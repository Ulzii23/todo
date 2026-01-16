'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser } from '@/lib/context/user-provider';
import { toast } from "sonner"

interface Task {
  id: number;
  title: string;
  complete: boolean;
  createdAt: string;
  updatedAt: string;
  task_at: string;
}

interface TasksContextType {
  tasks: Task[];
  taskAt: string;
  addTask: (opts: { title: string, task_at: string }) => Promise<Task>;
  refresh: (opts?: { taskAt?: string }) => Promise<void>;
  toggleTask: (id: number, isDone: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  loading: boolean;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskAt, setTaskAt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasks = async (opts?: { taskAt?: string }) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (opts?.taskAt) params.set('task_at', opts.taskAt);
      const url = '/api/task' + (params.toString() ? `?${params.toString()}` : '');
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setTasks(data.data || []);
      setTaskAt(data.task_at);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const addTask = async (opts: { title: string, task_at: string }) => {
    try {
      setLoading(true);
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: opts.title, task_at: opts.task_at }),
      });
      if (!res.ok) return;
      const created = await res.json();
      setTasks(prev => [created, ...prev]);
      toast.success(`${created?.title} - created`);
      return created;
    } catch (err) {
      console.error('Failed to create task', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: number, complete: boolean) => {
    const task = tasks.find(t => t.id == id);
    try {
      setLoading(true);
      const res = await fetch(`/api/task/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complete }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      toast.success(`${task?.title}`);
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, complete: updated.complete, updatedAt: updated.updatedAt } : t)));
    } catch (err) {
      console.error('Failed to toggle task', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/task/${id}`, { method: 'DELETE' });
      if (!res.ok) return;
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success(`Task deleted`);
    } catch (err) {
      console.error('Failed to delete task', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    const originalTask = tasks.find(t => t.id === id);
    try {
      setLoading(true);
      // Optimistic update
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));

      const res = await fetch(`/api/task/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error('Failed to update');
      }

      const updated = await res.json();
      // Update with server response to be sure
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
      toast.success(`Task updated`);
    } catch (err) {
      console.error('Failed to update task', err);
      // Revert on failure
      if (originalTask) {
        setTasks(prev => prev.map(t => (t.id === id ? originalTask : t)));
      }
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, refresh: fetchTasks, toggleTask, deleteTask, updateTask, taskAt, loading }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
