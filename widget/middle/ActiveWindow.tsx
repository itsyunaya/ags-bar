import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import Pango from 'gi://Pango';
import { createBinding, With } from 'gnim';

export default function ActiveWindow() {
	const hyprland = AstalHyprland.get_default();
	const client = createBinding(hyprland, 'focused_client');

	return (
		<box class="elem">
			<With value={client}>
				{(c) =>
					c && (
						<label
							max_width_chars={100}
							ellipsize={Pango.EllipsizeMode.END}
							label={createBinding(c, 'title')}
						/>
					)
				}
			</With>
		</box>
	);
}
