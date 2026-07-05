import {Gtk} from "ags/gtk4";
import {execAsync} from "ags/process";

// todo: add confirm prompt to shutdown/reboot
export default function Menu() {
	return (
		<menubutton>
			<label css="font-size: 22px;" xalign={0} label=""/>
			<popover>
				<box spacing={4} orientation={Gtk.Orientation.VERTICAL}>
					<button onClicked={(async () => {
						await execAsync("poweroff")
					})}>   Power off
					</button>
					<button onClicked={(async () => {
						await execAsync("reboot")
					})}>   Reboot
					</button>
					<button onClicked={(async () => {
						// todo: unhardcode terminal (maybe via env var)
						await execAsync("kitty")
					})}>    Launch Terminal
					</button>
				</box>
			</popover>
		</menubutton>
	)
}