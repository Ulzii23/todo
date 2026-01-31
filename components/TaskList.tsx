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
import { ShinyButton } from "@/components/ui/shiny-button"
import { Input } from "@/components/ui/input"
import { ArrowRightIcon, ArrowLeftIcon, CalendarIcon, PencilIcon, CheckIcon, XIcon, RotateCcw } from "lucide-react"
import moment from 'moment';
import Dashboard from '@/app/_tasks/dashboard'
import CalendarDashboard from '@/app/_tasks/calendar-dashboard';
import { motion, useMotionValue, useTransform } from "motion/react"
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
            <Button variant="outline" className='flex-[2] h-12 font-semibold text-lg hover:bg-gray-50 transition-colors relative overflow-hidden'>
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
          sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </ul>
    </div>
  )
}

function TaskItem({ task }: { task: any }) {
  const { toggleTask, deleteTask, updateTask, taskAt } = useTasks();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Motion values for swipe feedback
  const x = useMotionValue(0);

  // We used useTransform directly before, but we need conditional logic based on task.complete.
  // However, useTransform hooks need to be consistent. 
  // We will control the specific output range values based on state.

  const background = useTransform(x, [-100, 100], ["none", "none"]);

  const leftOpacity = useTransform(x, [30, 120], [0, 1]);
  const rightOpacity = useTransform(x, [-30, -120], [0, 1]);

  const bgColor = useTransform(
    x,
    [-250, -100, 0, 100, 250],
    [
      "rgba(239, 68, 68, 1)", // Red
      "rgba(239, 68, 68, 1)",
      "rgba(255, 255, 255, 0)", // Transparent Center
      task.complete ? "rgba(34, 197, 94, 0)" : "rgba(34, 197, 94, 1)", // Green
      task.complete ? "rgba(34, 197, 94, 0)" : "rgba(34, 197, 94, 1)"
    ]
  );

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

  return (
    <li className="relative overflow-hidden mb-2 rounded-xl shadow-sm border border-transparent hover:border-border/50 transition-all text-card-foreground">
      {/* Dynamic Background Layout */}
      <motion.div
        className="absolute inset-0 flex items-center justify-between pointer-events-none z-0"
        style={{ backgroundColor: bgColor }}
      >
        {/* Complete Indicator (Left) - Only if not complete */}
        {!task.complete && (
          <motion.div style={{ opacity: leftOpacity }} className="flex items-center gap-2 text-white font-medium pl-6">
            <CheckIcon className="w-5 h-5" />
            <span className="text-sm">Complete</span>
          </motion.div>
        )}

        {/* Delete/Undo Indicator (Right) */}
        <motion.div style={{ opacity: rightOpacity }} className="flex items-center gap-2 text-white font-medium pr-6 ml-auto">
          {task.complete ? <span className="text-sm">Undo</span> : <span className="text-sm">Delete</span>}
          {task.complete ? <RotateCcw className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 1, right: task.complete ? 0.3 : 1 }}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (editingId === task.id) return;

          if (info.offset.x < -150) {
            // swipe left (delete/undo)
            if (!task.complete) {
              deleteTask(task.id);
            } else {
              toggleTask(task.id, false)
            }
          } else if (info.offset.x > 150) {
            // swipe right (complete)
            if (!task.complete) {
              toggleTask(task.id, true);
            }
          }
        }}
        className={cn(
          "relative z-10 touch-pan-y group bg-card",
          task.complete && 'bg-muted/30 opacity-70 p-4'
        )}
      >
        {!task.complete ? (
          <ShinyButton
            className="w-full text-left bg-transparent border-none p-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
            onClick={() => isEditable(task.task_at) && startEditing(task)}
          >
            <TaskContent
              task={task}
              editingId={editingId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              saveEditing={saveEditing}
              cancelEditing={cancelEditing}
              startEditing={startEditing}
              isEditable={isEditable}
            />
          </ShinyButton>
        ) : (
          <TaskContent
            task={task}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            saveEditing={saveEditing}
            cancelEditing={cancelEditing}
            startEditing={startEditing}
            isEditable={isEditable}
          />
        )}
      </motion.div>
    </li>
  );
}

function TaskContent({
  task,
  editingId,
  editTitle,
  setEditTitle,
  saveEditing,
  cancelEditing,
  startEditing,
  isEditable
}: any) {
  return (
    <div className='flex items-center justify-between gap-2 w-full'>
      {editingId === task.id ? (
        <div className="flex w-full gap-2 items-center" onClick={(e) => e.stopPropagation()}>
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
          <div
            className={cn(
              "font-medium flex-1 transition-all duration-300 text-left",
              task.complete && "line-through text-muted-foreground decoration-green-500/50 decoration-2"
            )}
          >
            {task.title}
          </div>
          <div className="flex items-center gap-2">
            {task.complete && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-green-600"
              >
                <CheckIcon className="w-5 h-5" />
              </motion.div>
            )}
            {task.complete && <span className="text-xs text-muted-foreground block">{moment(task.updatedAt).format('HH:mm')}</span>}
            {!task.complete && isEditable(task.task_at) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(task);
                }}
              >
                <PencilIcon className="h-3 w-3 text-muted-foreground" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Remove Shimmer component if not used elsewhere

