import AstalHyprland from "gi://AstalHyprland?version=0.1";
import {createBinding, With} from "gnim";

// todo: set max width
export default function ActiveWindow() {
	const hyprland = AstalHyprland.get_default()
	const client = createBinding(hyprland, "focused_client")

	return (
		<box class="elem">
			<With value={client}>
				{(c) => c && <label label={createBinding(c, "title")} />}
			</With>
		</box>
	)
}