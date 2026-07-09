import { createComputed, createState, onCleanup } from 'gnim';
import { Gtk } from 'ags/gtk4';

export default function Water() {
	const cooldown = 7200;

	const [resTime, setResTime] = createState<number>(cooldown);
	const id = setInterval(() => {
		if (resTime() > 0) setResTime(resTime() - 1);
	}, 1000);

	const normalize = (value: number, min: number, max: number): number => {
		if (min === max) return 0;
		return (value - min) / (max - min);
	};

	onCleanup(() => clearInterval(id));

	return (
		<button onClicked={() => setResTime(cooldown)}>
			<box spacing={8}>
				<label label="󰖌" />
				<levelbar
					valign={Gtk.Align.CENTER}
					heightRequest={13}
					widthRequest={80}
					value={createComputed(() => normalize(resTime(), 0, cooldown))}
				/>
			</box>
		</button>
	);
}
