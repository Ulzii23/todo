"use client"

import React, { useState } from 'react'
import { useTasks } from '@/lib/tasksContext'

export default function TaskList() {
  const { tasks, refresh, toggleTask, deleteTask } = useTasks();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const applyFilter = async () => {
    await refresh({ startDate: startDate || undefined, endDate: endDate || undefined });
  };

  return (
    <div className="space-y-2 mt-6">
      <div className="flex gap-2 items-center mb-4">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-1 rounded" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-1 rounded" />
        <button onClick={applyFilter} className="px-3 py-1 bg-gray-200 rounded">Filter</button>
        <button onClick={() => refresh()} className="px-3 py-1 bg-gray-100 rounded">Clear</button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks yet.</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="p-3 border rounded">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={task.isDone} onChange={() => toggleTask(task.id, !task.isDone)} />
                <div>
                  <div className={`font-medium ${task.isDone ? 'line-through text-gray-500' : ''}`}>{task.name}</div>
                  <div className="text-sm text-gray-500">{new Date(task.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div>
                <button onClick={() => deleteTask(task.id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
