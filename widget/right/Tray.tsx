import {createBinding, For} from "gnim";
import AstalTray from "gi://AstalTray?version=0.1";
import {Gtk} from "ags/gtk4";

// todo: change impl so that icons are located in a submenu
export default function Tray() {
	const tray = AstalTray.get_default()
	const items = createBinding(tray, "items")

	function initButton(self: Gtk.Button, item: AstalTray.TrayItem) {
		const popover = Gtk.PopoverMenu.new_from_model(item.menuModel)
		popover.set_parent(self)
		self.insert_action_group("dbusmenu", item.actionGroup)

		self.connect("clicked", () => {
			popover.popup()
		})
	}

	return (
		<box class="elem">
			<For each={items}>
				{(item) => (
					<button
						$={(self) => initButton(self, item)}
						css="background: none; padding: 2px; margin: 0; min-height: 0; min-width: 0;"
					>
						<image gicon={createBinding(item, "gicon")} />
					</button>
				)}
			</For>
		</box>
	)
}