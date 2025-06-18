import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddTaskForm from "@/components/AddTaskForm";
import TasksList from "@/components/TasksList";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.firstName || "User"}!
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:underline">
              Home
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add a New Task</h2>
          <AddTaskForm />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <TasksList />
        </div>
      </div>
    </main>
  );
}