"use client"

import { useTasks } from '@/lib/context/tasks-provider'

import {
  ButtonGroup,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, ArrowLeftIcon, CalendarIcon } from "lucide-react"
import moment from 'moment';
import Dashboard from '@/app/_tasks/dashboard'
import { motion } from "motion/react"
import { cn } from '@/lib/utils'


export default function TaskList() {
  const { tasks, refresh, toggleTask, deleteTask, taskAt, loading } = useTasks();

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

  return (
    <div className="space-y-2">
      <ButtonGroup className='w-full'>
        <Button variant="outline" className='flex-1' aria-label="Previous" onClick={() => applyFilter("prev")}>
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline" className='flex-2'><CalendarIcon /> {taskAt ? new Date(taskAt).toLocaleDateString() : ''}</Button>
        <Button variant="outline" aria-label="Next" className='flex-1' onClick={() => applyFilter("next")}>
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
                  if (info.offset.x < -100) {
                    // swipe left
                     if(!task.complete){
                      deleteTask(task.id);
                    }else {
                      toggleTask(task.id, false)
                    }
                  } else if (info.offset.x > 100) {
                    // swipe right
                    toggleTask(task.id, true)
                  }
                }}
                className={cn("relative touch-pan-y bg-white rounded shadow p-3", task.complete && 'opacity-90')}
                initial={{scale: 0}}
                animate={{ scale: 1 }}
              >
              <div className='flex items-center justify-between gap-2'>
                  <div className={`font-medium ${task.complete ? 'line-through text-gray-500' : ''}`}>{task.title}</div>
                  { task.complete && <span className="text-xs text-gray-500 block">{moment(task.updatedAt).format('HH:mm')}</span>}
                </div>
                {!task.complete && <Shimmer/>}
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
