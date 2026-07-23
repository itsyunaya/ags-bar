import { createComputed, onCleanup } from 'gnim';
import { Gtk } from 'ags/gtk4';
import {
	hideWaterWidget,
	setWaterRemTime,
	waterCooldown,
	waterRemTime,
} from '../../state';

export default function Water() {
	if (hideWaterWidget) return <></>;

	const id = setInterval(() => {
		if (waterRemTime() > 0) setWaterRemTime(waterRemTime() - 1);
	}, 1000);

	const normalize = (value: number, min: number, max: number): number => {
		if (min === max) return 0;
		return (value - min) / (max - min);
	};

	onCleanup(() => clearInterval(id));

	return (
		<button onClicked={() => setWaterRemTime(waterCooldown)}>
			<box spacing={8}>
				<label label="󰖌" />
				<levelbar
					valign={Gtk.Align.CENTER}
					heightRequest={13}
					widthRequest={80}
					value={createComputed(() => normalize(waterRemTime(), 0, waterCooldown))}
				/>
			</box>
		</button>
	);
}
