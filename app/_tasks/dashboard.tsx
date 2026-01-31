import { useTasks } from "@/lib/context/tasks-provider";
import { motion } from "motion/react";

const percentColor = (percent: number) => {
    if (percent >= 75) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
}

const Dashboard = () => {
    const { tasks, loading } = useTasks();
    const completedTasks = tasks.filter(task => task.complete).length;
    const successRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    if (loading) {
        return <div className="h-4 w-full bg-gray-100 animate-pulse rounded-full" />
    }

    return (
        <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-sm space-y-2">
            <div className="flex gap-2 justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                <p>Tasks: <span className="text-foreground">{completedTasks}/{tasks.length}</span></p>
                <p>Progress: <span className="text-foreground">{successRate.toFixed(0)}%</span></p>
            </div>

            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${percentColor(successRate)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${successRate}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

export default Dashboard;