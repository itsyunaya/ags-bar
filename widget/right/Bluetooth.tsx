import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import {createBinding, createComputed} from "gnim";
import {execAsync} from "ags/process";
import {Gtk} from "ags/gtk4";

// this function is very basic right now and doesn't actually show any
// bt specific information beyond if it's active, to add is:
// todo: show connected devices, device info
export default function Bluetooth() {
	const bt = AstalBluetooth.get_default()
	const pow = createBinding(bt, "is_powered")


	function initClick(self: Gtk.Button) {
		const click = new Gtk.GestureClick({ button: 0 })
		click.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)
		click.connect("released", async (gesture) => {
			const button = gesture.get_current_button()
			if (button === 1) {
				await execAsync("bluetoothctl power on")
			} else if (button === 3) {
				await execAsync("bluetoothctl power off")
			}
		})
		self.add_controller(click)
	}

	return (
		<button
			css="padding: 3px;"
			$={(self) => initClick(self)}
			label={createComputed(() => {
				return pow() ? "󰂯" : "󰂲"
			})}
		/>
	)
}
