import {createBinding, For} from "gnim";
import AstalTray from "gi://AstalTray?version=0.1";
import {Gtk} from "ags/gtk4";

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
		<menubutton>
			<popover>
				<box>
					<For each={items}>
						{(item) => (
							<button
								$={(self) => initButton(self, item)}
								css="padding: 4px;"
							>
								<image gicon={createBinding(item, "gicon")}/>
							</button>
						)}
					</For>
				</box>
			</popover>
		</menubutton>
	)
}