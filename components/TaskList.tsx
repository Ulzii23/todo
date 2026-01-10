"use client"

import React, { useEffect, useState } from 'react'
import { useTasks } from '@/lib/tasksContext'

import {
  ButtonGroup,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react"
import moment from 'moment';

export default function TaskList() {
  const { tasks, refresh, toggleTask, deleteTask, createdAt } = useTasks();
  const [fetchDate, setFetchDate] = useState<string>('');

  useEffect(()=>{

    setFetchDate(createdAt);
  },[createdAt]);



  const applyFilter = async (opt: string) => {
    let fDate = moment(createdAt);
    if(opt === 'prev'){
      fDate = fDate.subtract(1, 'days');
    }else if(opt === 'next'){
      fDate = fDate.add(1, 'days');
    }
    const formattedDate = fDate.format('YYYY-MM-DD');

    await refresh({ createdAt: formattedDate || undefined});
  };

  
  return (
    <div className="space-y-2 mt-6">
      <ButtonGroup className='w-full'>
        <Button variant="outline" size="lg" className='flex-1' aria-label="Previous" onClick={()=>applyFilter("prev")}>
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline" size="lg" className='flex-2'>{createdAt ? new Date(createdAt).toLocaleDateString() : ''}</Button>
        <Button variant="outline" size="lg" aria-label="Next" className='flex-1' onClick={()=>applyFilter("next")}>
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
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
