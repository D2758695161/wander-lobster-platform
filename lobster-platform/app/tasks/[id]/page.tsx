import TasksTaskClient from "./TasksTaskClient";

export function generateStaticParams() {
  return [{ id: "demo-1" }, { id: "demo-2" }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <TasksTaskClient taskId={params.id} />;
}
