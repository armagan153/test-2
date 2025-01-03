import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Phone, Users, CheckSquare, BarChart } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: customers } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const { data: calls } = useQuery<any[]>({
    queryKey: ["/api/calls"],
  });

  const { data: tasks } = useQuery<any[]>({
    queryKey: ["/api/tasks"],
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gösterge Paneli</h1>

      {/* İstatistik kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Çağrı</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calls?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Açık Görevler</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks?.filter(t => t.status !== "completed").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Görev Tamamlama</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Progress 
              value={tasks ? (tasks.filter(t => t.status === "completed").length / tasks.length) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Son aktiviteler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calls?.slice(0, 5).map(call => (
              <div key={call.id} className="flex items-center">
                <div className="ml-4">
                  <p className="text-sm font-medium">{call.customer.name} ile görüşme</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(call.createdAt), "d MMMM yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}