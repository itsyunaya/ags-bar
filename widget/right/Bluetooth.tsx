import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import {createBinding, createComputed, For} from "gnim";
import {execAsync} from "ags/process";
import {Gtk} from "ags/gtk4";

export default function Bluetooth() {
	const bt = AstalBluetooth.get_default()
	const pow = createBinding(bt, "is_powered")
	const devs = createBinding(bt, "devices")

	const connectedDevices = createComputed(() => {
		const res: AstalBluetooth.Device[] = [];
		for (const dev of devs()) {
			const connected = createBinding(dev, "connected")()
			if (connected) res.push(dev)
		}

		return res;
	})

	return (
		<menubutton>
			<label label={createComputed(() => {
				if (pow()) {
					if (connectedDevices().length > 0) return `󰂱  ${connectedDevices().length}`
					return "󰂯"
				}
				return "󰂲"
			})}/>
			<popover>
				<box spacing={10} orientation={Gtk.Orientation.VERTICAL}>
					<button
						label="Toggle Bluetooth"
						onClicked={async () => {
							if (pow()) await execAsync("bluetoothctl power off");
							else await execAsync("bluetoothctl power on")
						}}
					/>
					<box visible={createComputed(() => {
						return connectedDevices().length > 0
					})} orientation={Gtk.Orientation.VERTICAL}>
						<For each={connectedDevices}>
							{(device) => (
								<label label={createComputed(() =>
									`${createBinding(device, "name")()}: ${createBinding(device, "address")()}`
								)}/>
							)}
						</For>
					</box>
				</box>
			</popover>
		</menubutton>
	)
}
