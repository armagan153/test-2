import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhoneCall, User } from "lucide-react";
import type { Call, Customer } from "@db/schema";
import { format } from "date-fns";
import { useUser } from "@/hooks/use-user";

const statusColors = {
  completed: "bg-green-100 text-green-800",
  missed: "bg-red-100 text-red-800",
  followup: "bg-yellow-100 text-yellow-800",
};

const statusNames = {
  completed: "Tamamlandı",
  missed: "Cevapsız",
  followup: "Takip Gerekli"
};

export default function Calls() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const { data: calls } = useQuery<(Call & { customer: Customer })[]>({
    queryKey: ["/api/calls"],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const addCall = useMutation({
    mutationFn: async (data: Partial<Call>) => {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Çağrı kaydedilemedi");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calls"] });
      setIsOpen(false);
      toast({
        title: "Başarılı",
        description: "Çağrı başarıyla kaydedildi",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message,
      });
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addCall.mutate({
      customerId: parseInt(formData.get("customerId") as string),
      agentId: user!.id,
      notes: formData.get("notes") as string,
      duration: parseInt(formData.get("duration") as string),
      status: formData.get("status") as string,
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Çağrılar</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PhoneCall className="h-4 w-4 mr-2" />
              Çağrı Kaydet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Çağrı Kaydet</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerId">Müşteri</Label>
                <Select name="customerId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Müşteri seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Süre (saniye)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Durum</Label>
                <Select name="status" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                    <SelectItem value="missed">Cevapsız</SelectItem>
                    <SelectItem value="followup">Takip Gerekli</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notlar</Label>
                <Textarea id="notes" name="notes" />
              </div>
              <Button type="submit" className="w-full">
                Çağrıyı Kaydet
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>Temsilci</TableHead>
                <TableHead>Süre</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Notlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls?.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {call.customer.name}
                    </div>
                  </TableCell>
                  <TableCell>{user?.username}</TableCell>
                  <TableCell>{call.duration}s</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[call.status as keyof typeof statusColors]}
                    >
                      {statusNames[call.status as keyof typeof statusNames]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(call.createdAt), "d MMMM yyyy")}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {call.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}