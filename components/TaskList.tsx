"use client"

import { useTasks } from '@/lib/context/tasks-provider'

import {
  ButtonGroup,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, ArrowLeftIcon, CircleXIcon } from "lucide-react"
import moment from 'moment';
import Dashboard from '@/app/_tasks/dashboard'

export default function TaskList() {
  const { tasks, refresh, toggleTask, deleteTask, taskAt, loading } = useTasks();

  const applyFilter = async (opt: string) => {
    let fDate = moment(taskAt);
    if(opt === 'prev'){
      fDate = fDate.subtract(1, 'days');
    }else if(opt === 'next'){
      fDate = fDate.add(1, 'days');
    }
    const formattedDate = fDate.format('YYYY-MM-DD');

    await refresh({ taskAt: formattedDate || undefined});
  };

  const sortedTasks = tasks.sort((a, b) => {
    // false = 0, true = 1 → incomplete tasks first
    if (a.complete === b.complete) {
      return a.id - b.id; // keep the order by id if complete status is same
    }
    return a.complete ? 1 : -1;
  });
    
  return (
    <div className="space-y-2">
      <ButtonGroup className='w-full'>
        <Button variant="outline" className='flex-1' aria-label="Previous" onClick={()=>applyFilter("prev")}>
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline" className='flex-2'>{taskAt ? new Date(taskAt).toLocaleDateString() : ''}</Button>
        <Button variant="outline" aria-label="Next" className='flex-1' onClick={()=>applyFilter("next")}>
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
      <Dashboard/>
      {tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks yet.</p>
      ) : (
        sortedTasks.map(task => (
          <div key={task.id} className="py-1 px-2 border rounded bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={task.complete} onChange={() => toggleTask(task.id, !task.complete)} disabled={loading} />
                <div>
                  <div className={`font-medium text-sm ${task.complete ? 'line-through text-gray-500' : ''}`}>{task.title}</div>
                  { task.complete && <span className="text-xs text-gray-500">{moment(task.updatedAt).format('YYYY-MM-DD HH:mm')}</span>}
                </div>
              </div>
              <div>
                <Button onClick={() => deleteTask(task.id)} size={"icon-sm"} variant={"ghost"} disabled={loading}>
                  <CircleXIcon className='text-sm text-muted-foreground'/>
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
