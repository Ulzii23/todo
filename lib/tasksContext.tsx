'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Task {
  id: number;
  name: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  refresh: (opts?: { startDate?: string; endDate?: string }) => Promise<void>;
  toggleTask: (id: number, isDone: boolean) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async (opts?: { startDate?: string; endDate?: string }) => {
    try {
      const params = new URLSearchParams();
      if (opts?.startDate) params.set('startDate', opts.startDate);
      if (opts?.endDate) params.set('endDate', opts.endDate);
      const url = '/api/task' + (params.toString() ? `?${params.toString()}` : '');
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
    <TasksContext.Provider value={{ tasks, addTask, refresh: fetchTasks, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
