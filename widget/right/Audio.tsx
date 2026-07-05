import {createBinding, createComputed} from "gnim";
import AstalWp from "gi://AstalWp?version=0.1";
import {execAsync} from "ags/process";

// todo: add scroll to change mic/headphone vol
export default function Audio() {
	const {defaultSpeaker: speaker, defaultMicrophone: mic} = AstalWp.get_default()!
	const volume = createBinding(speaker, "volume")
	const micVol = createBinding(mic, "volume")
	const mute = createBinding(mic, "mute")
	const deafen = createBinding(speaker, "mute")

	return (
		<box class="elem">
			<button
				onClicked={async () => {
					await execAsync("amixer sset 'Capture' toggle")
				}}
				css="padding: 2px 4px; background: none;"
			>
				<label
					label={createComputed(() =>
						mute() ? " " : `  ${Math.round(micVol() * 100)}%`
					)}
				/>
			</button>
			<button
				onClicked={(async () => {
					await execAsync("hyprctl dispatch 'hl.dsp.exec_cmd(\"pavucontrol\", { float = true, size = {1000, 500}})'")
				})}
				css="padding: 2px 4px; background: none;"
			>
				<label
					label={createComputed(() =>
						deafen() ? "󰝟" : `󰕾  ${Math.round(volume() * 100)}%`
					)}
				/>
			</button>
		</box>
	)
}
