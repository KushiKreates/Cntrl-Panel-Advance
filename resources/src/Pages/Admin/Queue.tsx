import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Cards/header";
import AppAlert from "@/components/Alert/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

interface DataPoint {
  time: string;
  pending: number;
}

const QueueMonitor: React.FC = () => {
  const [connected, setConnected] = useState(false);         // SSE connection
  const [workerRunning, setWorkerRunning] = useState(false); // queue:work process
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const lastEventRef = useRef<number>(0);

  useEffect(() => {
    const es = new EventSource("/queue/stream");

    es.onopen = () => {
      setConnected(true);
      lastEventRef.current = Date.now();
    };

    es.addEventListener("queue-size", (e: MessageEvent) => {
      const { pending, timestamp } = JSON.parse(e.data);
      const displayTime = new Date(timestamp).toLocaleTimeString();

      setDataPoints((prev) => [...prev.slice(-9), { time: displayTime, pending }]);
      setLogs((prev) => [...prev.slice(-9), `${displayTime} — ${pending} pending`]);
      lastEventRef.current = new Date(timestamp).getTime();
    });

    es.addEventListener("worker-status", (e: MessageEvent) => {
      const { running } = JSON.parse(e.data);
      setWorkerRunning(running);
    });

    es.onerror = () => {
      setConnected(false);
    };

    return () => es.close();
  }, []);

  const isOnline = connected && workerRunning;

  return (
    <>
      <Header page="Queue Monitor" />
      <AppAlert />

      <div className="p-4">
        <h2 className="text-6xl font-bold px-2">Queue Status</h2>
        <div className="px-3 mb-4 flex items-center space-x-2">
          <span>Application queue is</span>
          <Badge className={isOnline ? "bg-green-500" : "destructive"} variant={isOnline ? "success" : "destructive"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Chart Container */}
          <Card className="flex-1 h-80 lg:h-[500px]">
            <CardHeader>
              <CardTitle>Queue Size Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataPoints}>
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Logs Container */}
          <Card className="w-full lg:w-1/3 h-80 lg:h-[500px] overflow-y-auto">
            <CardHeader>
              <CardTitle>Last 20 Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {logs.slice(-20).map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-center h-8 px-3 bg-zinc-50 dark:bg-zinc-800 rounded-md"
                >
                  <Clock className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mr-2" />
                  <span className="text-xs text-zinc-700 dark:text-zinc-200">{log}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default QueueMonitor;