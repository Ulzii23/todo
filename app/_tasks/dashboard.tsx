import { useTasks } from "@/lib/context/tasks-provider";

const percentColor = (percent: number) => {
    if (percent >= 75) return 'text-green-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-red-600';
}
const Dashboard = () => {
    const { tasks, loading } = useTasks();
    const successRate = tasks ? (tasks.filter(task => task.complete).length / tasks.length) * 100 : 0;
    if (loading) {
        return <p className="text-xs">Loading...</p>
    }

    return (
        <div className="flex gap-2 justify-between text-xs">
            <p>Total Tasks: <span className="font-medium">{tasks.length}</span></p>
            {
                tasks.length > 0 && <p>Success Rate: <span className={`font-medium ${percentColor(successRate)}`}>
                    {successRate.toFixed(2)}%
                </span></p>
            }

        </div>
    );
}

export default Dashboard;