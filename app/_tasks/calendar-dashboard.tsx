"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/context/tasks-provider";
import { cn } from "@/lib/utils";

interface DayStats {
    total: number;
    completed: number;
    rate: number;
}

export default function CalendarDashboard({ onDateSelect }: { onDateSelect?: () => void }) {
    const { refresh, taskAt } = useTasks();
    const [currentMonth, setCurrentMonth] = useState(moment());
    const [stats, setStats] = useState<Record<string, DayStats>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sync calendar month with selected task date if it exists
        if (taskAt) {
            setCurrentMonth(moment(taskAt));
        }
    }, [taskAt]);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const monthStr = currentMonth.format("YYYY-MM");
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/stats?month=${monthStr}`, {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [currentMonth.format("YYYY-MM")]);

    const daysInMonth = currentMonth.daysInMonth();
    const startDay = currentMonth.clone().startOf("month").day(); // 0 = Sunday
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(currentMonth.clone().date(i));
    }

    const handleDateClick = (date: moment.Moment) => {
        refresh({ taskAt: date.format("YYYY-MM-DD") });
        if (onDateSelect) onDateSelect();
    };

    const getSuccessColor = (rate: number) => {
        if (rate >= 75) return "bg-green-500 shadow-green-200";
        if (rate >= 50) return "bg-yellow-500 shadow-yellow-200";
        if (rate > 0) return "bg-red-500 shadow-red-200";
        return "bg-gray-100";
    };

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setCurrentMonth(prev => prev.clone().subtract(1, "month"))}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-bold text-lg">{currentMonth.format("MMMM YYYY")}</div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setCurrentMonth(prev => prev.clone().add(1, "month"))}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 relative min-h-[200px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm rounded-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                )}
                {days.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} />;

                    const dateStr = date.format("YYYY-MM-DD");
                    const dayStats = stats[dateStr];
                    const isSelected = taskAt === dateStr;
                    const isToday = date.isSame(moment(), 'day');

                    return (
                        <div
                            key={dateStr}
                            onClick={() => handleDateClick(date)}
                            className={cn(
                                "aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200 hover:scale-110 relative border border-transparent",
                                isSelected && "border-black bg-black text-white shadow-lg",
                                !isSelected && "hover:bg-gray-50",
                                isToday && !isSelected && "bg-gray-100 font-bold"
                            )}
                        >
                            <span className="text-sm">{date.date()}</span>
                            {dayStats && dayStats.rate > 0 && (
                                <div className={cn("w-1.5 h-1.5 rounded-full mt-1 shadow-sm", getSuccessColor(dayStats.rate), isSelected && "bg-white")} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
