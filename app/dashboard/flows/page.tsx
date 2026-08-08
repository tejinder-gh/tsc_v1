import { getClientsWithFlows } from "./actions";
import { FlowList } from "./flow-list";

export const metadata = {
  title: "Agentic Flows | TheSkillCorner",
};

export default async function FlowsPage() {
  const clients = await getClientsWithFlows();

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Agentic Flows</h1>
        <p className="text-slate-500">Manage and enable automation recipes for your clients.</p>
      </div>
      <FlowList clients={clients} />
    </div>
  );
}
