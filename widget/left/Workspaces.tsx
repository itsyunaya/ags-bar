import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { createBinding, createComputed, createState, For, onCleanup } from 'gnim';

export default function Workspaces() {
	const hyprland = AstalHyprland.get_default();
	const workspaces = createBinding(hyprland, 'workspaces');
	const focused = createBinding(hyprland, 'focusedWorkspace');
	const sortedWorkspaces = createComputed(() => [...workspaces()].sort((a, b) => a.id - b.id));
	const [urgentWorkspaceIds, setUrgentWorkspaceIds] = createState<Set<number>>(new Set());

	const urgentId = hyprland.connect('urgent', (_, client: AstalHyprland.Client) => {
		const wsId = client?.workspace?.id;
		if (wsId !== undefined) {
			setUrgentWorkspaceIds((prev) => new Set(prev).add(wsId));
		}
	});

	onCleanup(() => hyprland.disconnect(urgentId));

	const unsubFocus = focused.subscribe(() => {
		const f = focused.peek();
		if (f && urgentWorkspaceIds.peek().has(f.id)) {
			setUrgentWorkspaceIds((prev) => {
				const next = new Set(prev);
				next.delete(f.id);
				return next;
			});
		}
	});

	onCleanup(unsubFocus);

	return (
		<box spacing={10} class="elem">
			<For each={sortedWorkspaces}>
				{(ws) => (
					<label
						label={createComputed(() => {
							if (focused().id === ws.id) return '󰺕';
							if (urgentWorkspaceIds().has(ws.id)) return '';
							return '󰧞';
						})}
						css="font-size: 16px;"
					/>
				)}
			</For>
		</box>
	);
}
