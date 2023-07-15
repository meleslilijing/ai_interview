import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const AgentItem = () => {
  return (<li className="flex justify-between items-center border-b p-5">
    <div className="flex gap-5 items-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      Agent Name
    </div>
    <span>Status</span>
    <Button variant="outline">Edit</Button>
  </li>)
}

export default function Home() {
  return (<section className="flex h-screen">
    <div className="w-1/5 h-full border-r">
      <h1 className="my-8 text-center">Gopher AI</h1>
      <div className="border-y"><Button className="w-full">Agents</Button></div>
      <div className="border-b"><Button className="w-full">Settings</Button></div>
    </div>
    <div className="flex-1 h-full bg-slate-50 p-10">
      <div className="my-15 border-b flex justify-end py-10"><Button variant="outline">Create Agent</Button></div>
      <ul>
        <AgentItem />
        <AgentItem />
        <AgentItem />
      </ul>
    </div>

  </section>)
}
