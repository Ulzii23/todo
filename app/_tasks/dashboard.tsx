import { useTasks } from "@/lib/context/tasks-provider";

const Dashboard = () => {
const { tasks, loading } = useTasks();
const successRate = tasks ? (tasks.filter(task => task.isDone).length / tasks.length) * 100 : 0;
if(loading){
    return <p>Loading...</p>
}
    return (
        <div>
  <div className="flex gap-2 justify-between">
                <p>Total Tasks: {tasks.length}</p>
                {
                    tasks.length > 0 && <p>Success Rate: <span className="font-medium">
                                {successRate.toFixed(2)}%
                                </span></p>
                }
                            
                </div>
        </div>
      
    );
}

export default Dashboard;