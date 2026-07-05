import AstalHyprland from "gi://AstalHyprland?version=0.1";
import {createBinding, createComputed, For} from "gnim";

export default function Workspaces() {
	const hyprland = AstalHyprland.get_default()
	const workspaces = createBinding(hyprland, "workspaces")
	const focused = createBinding(hyprland, "focusedWorkspace")

	const sortedWorkspaces = createComputed(() => {
		return [...workspaces()].sort((a, b) => a.id - b.id);
	});

	return (
		<box spacing={10} class="elem">
			<For each={sortedWorkspaces}>
				{(ws) => (
					<label
						label={createComputed(() => {
							return focused().id === ws.id ? "󰺕" : "󰧞"
						})}
						css="font-size: 17px;"
					/>
				)}
			</For>
		</box>
	)
}