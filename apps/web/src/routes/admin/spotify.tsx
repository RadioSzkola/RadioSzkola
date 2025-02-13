import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/spotify')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/spotify"!</div>
}
