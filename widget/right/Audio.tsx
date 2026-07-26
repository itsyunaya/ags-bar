import { createBinding, createComputed } from 'gnim';
import AstalWp from 'gi://AstalWp?version=0.1';
import { execAsync } from 'ags/process';
import { Gtk } from 'ags/gtk4';

export default function Audio() {
	const { defaultSpeaker: speaker, defaultMicrophone: mic } = AstalWp.get_default()!;
	const volume = createBinding(speaker, 'volume');
	const deafen = createBinding(speaker, 'mute');
	const micVol = createBinding(mic, 'volume');
	const mute = createBinding(mic, 'mute');

	// 2% per scroll
	const step = 0.02;

	function scrollControl(widget: Gtk.Widget, onScroll: (dy: number) => void) {
		const controller = new Gtk.EventControllerScroll();
		controller.set_flags(Gtk.EventControllerScrollFlags.VERTICAL);
		controller.connect('scroll', (_, __, dy) => {
			onScroll(dy);
			return true;
		});

		widget.add_controller(controller);
	}

	const adjust = (obj: { volume: number; mute: boolean }, dy: number) => {
		if (obj.mute) return;
		obj.volume = Math.min(1, Math.max(0, obj.volume - dy * step));
	};

	return (
		<box class="elem">
			<button
				onClicked={async () => {
					await execAsync("amixer sset 'Capture' toggle");
				}}
				$={(self) => scrollControl(self, (dy) => adjust(mic, dy))}
				css="padding: 2px 4px; background: none;"
			>
				<label
					label={createComputed(() =>
						mute() ? ' ' : `  ${Math.round(micVol() * 100)}%`
					)}
				/>
			</button>
			<button
				onClicked={async () => {
					await execAsync(
						'hyprctl dispatch \'hl.dsp.exec_cmd("pwvucontrol", { float = true, size = {1000, 500}})\''
					);
				}}
				$={(self) => scrollControl(self, (dy) => adjust(speaker, dy))}
				css="padding: 2px 4px; background: none;"
			>
				<label
					label={createComputed(() =>
						deafen() ? '󰝟' : `󰕾  ${Math.round(volume() * 100)}%`
					)}
				/>
			</button>
		</box>
	);
}
