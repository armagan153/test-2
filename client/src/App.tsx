import { Switch, Route, Link } from "wouter";
import { Loader2 } from "lucide-react";
import { useUser } from "./hooks/use-user";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Layout, Users, PhoneCall, ListTodo } from "lucide-react";

// Page imports
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers"; 
import Calls from "./pages/Calls";
import Tasks from "./pages/Tasks";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-border">
        <div className="p-6">
          <h1 className="text-xl font-bold">Çağrı Merkezi CRM</h1>
        </div>
        <nav className="px-4 space-y-2">
          <Link href="/" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent">
            <Layout className="h-4 w-4 mr-2" />
            Gösterge Paneli
          </Link>
          <Link href="/customers" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent">
            <Users className="h-4 w-4 mr-2" />
            Müşteriler
          </Link>
          <Link href="/calls" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent">
            <PhoneCall className="h-4 w-4 mr-2" />
            Çağrılar
          </Link>
          <Link href="/tasks" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent">
            <ListTodo className="h-4 w-4 mr-2" />
            Görevler
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/customers" component={Customers} />
          <Route path="/calls" component={Calls} />
          <Route path="/tasks" component={Tasks} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Sayfa Bulunamadı</h1>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Aradığınız sayfa mevcut değil.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;