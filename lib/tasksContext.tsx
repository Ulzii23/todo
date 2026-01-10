'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser } from '@/lib/userContext';

interface Task {
  id: number;
  name: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TasksContextType {
  tasks: Task[];
  createdAt: string;
  addTask: (task: Task) => void;
  refresh: (opts?: { createdAt?: string }) => Promise<void>;
  toggleTask: (id: number, isDone: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  const fetchTasks = async (opts?: { createdAt?: string}) => {
    try {
      const params = new URLSearchParams();
      if (opts?.createdAt) params.set('created_at', opts.createdAt);
      const url = '/api/task' + (params.toString() ? `?${params.toString()}` : '');
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setTasks(data.data || []);
      setCreatedAt(data.created_at ? new Date(data.created_at) : null);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
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

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const toggleTask = async (id: number, isDone: boolean) => {
    try {
      const res = await fetch(`/api/task/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, isDone: updated.isDone } : t)));
    } catch (err) {
      console.error('Failed to toggle task', err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/task/${id}`, { method: 'DELETE' });
      if (!res.ok) return;
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, refresh: fetchTasks, toggleTask, deleteTask, createdAt }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
