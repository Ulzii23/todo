"use client"

import { useTasks } from '@/lib/context/tasks-provider'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  ButtonGroup,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRightIcon, ArrowLeftIcon, CalendarIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react"
import moment from 'moment';
import Dashboard from '@/app/_tasks/dashboard'
import CalendarDashboard from '@/app/_tasks/calendar-dashboard';
import { motion } from "motion/react"
import { cn } from '@/lib/utils'


export default function TaskList() {
  const { tasks, refresh, toggleTask, deleteTask, updateTask, taskAt, loading } = useTasks();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const applyFilter = async (opt: string) => {
    let fDate = moment(taskAt);
    if (opt === 'prev') {
      fDate = fDate.subtract(1, 'days');
    } else if (opt === 'next') {
      fDate = fDate.add(1, 'days');
    }
    const formattedDate = fDate.format('YYYY-MM-DD');

    await refresh({ taskAt: formattedDate || undefined });
  };

  const sortedTasks = tasks.sort((a, b) => {
    // false = 0, true = 1 → incomplete tasks first
    if (a.complete === b.complete) {
      return a.id - b.id; // keep the order by id if complete status is same
    }
    return a.complete ? 1 : -1;
  });

  const startEditing = (task: any) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEditing = async (id: number) => {
    if (!editTitle.trim()) return;
    await updateTask(id, { title: editTitle });
    setEditingId(null);
    setEditTitle('');
  };

  const isEditable = (taskDate: string) => {
    return moment(taskDate).isSameOrAfter(moment(), 'day');
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">

      <ButtonGroup className='w-full'>
        <Button variant="outline" className='flex-1 h-12' aria-label="Previous" onClick={() => applyFilter("prev")}>
          <ArrowLeftIcon />
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className='flex-[2] h-12 font-semibold text-lg hover:bg-gray-50 transition-colors'>
              <CalendarIcon className="mr-2 h-5 w-5" />
              {taskAt ? moment(taskAt).format('MMM D, YYYY') : 'Today'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <CalendarDashboard onDateSelect={() => setOpen(false)} />
          </DialogContent>
        </Dialog>

        <Button variant="outline" className='flex-1 h-12' aria-label="Next" onClick={() => applyFilter("next")}>
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
      <Dashboard />

      <ul className='space-y-2'>
        {tasks.length === 0 ? (
          <li className="text-muted-foreground">No tasks yet.</li>
        ) : (
          sortedTasks.map((task, index) => (
            <li key={index} className="relative overflow-hidden">
              <motion.div
                drag="x"
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  // Disable swipe actions if editing
                  if (editingId === task.id) return;

                  if (info.offset.x < -100) {
                    // swipe left
                    if (!task.complete) {
                      deleteTask(task.id);
                    } else {
                      toggleTask(task.id, false)
                    }
                  } else if (info.offset.x > 100) {
                    // swipe right
                    toggleTask(task.id, true)
                  }
                }}
                className={cn("relative touch-pan-y bg-white rounded shadow p-3", task.complete && 'opacity-90')}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className='flex items-center justify-between gap-2'>
                  {editingId === task.id ? (
                    <div className="flex w-full gap-2 items-center">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing(task.id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <Button size="icon" variant="ghost" onClick={() => saveEditing(task.id)}><CheckIcon className="w-4 h-4 text-green-600" /></Button>
                      <Button size="icon" variant="ghost" onClick={cancelEditing}><XIcon className="w-4 h-4 text-red-600" /></Button>
                    </div>
                  ) : (
                    <>
                      <div className={`font-medium flex-1 ${task.complete ? 'line-through text-gray-500' : ''}`} onClick={() => !task.complete && isEditable(task.task_at) && startEditing(task)}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.complete && <span className="text-xs text-gray-500 block">{moment(task.updatedAt).format('HH:mm')}</span>}
                        {!task.complete && isEditable(task.task_at) && (
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditing(task)}>
                            <PencilIcon className="h-3 w-3 text-gray-400" />
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {!task.complete && editingId !== task.id && <Shimmer />}
              </motion.div>
            </li>
          ))
        )}


      </ul>

    </div>
  )
}

function Shimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="
          absolute top-0 left-0 h-full
          w-full
          max-w-[60%]       /* extend beyond parent width */
          bg-gradient-to-r from-transparent via-green-200/50 to-transparent
          -skew-x-12
        "
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  )
}
