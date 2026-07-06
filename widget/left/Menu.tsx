import GLib from 'gi://GLib?version=2.0';
import { Gtk } from 'ags/gtk4';
import { execAsync } from 'ags/process';
import { createState } from 'gnim';

export default function Menu() {
	const confText = 'Are you sure?';

	const initPowText = '   Power off';
	const [pow, updPow] = createState(false);
	const [powTxt, updPowTxt] = createState(initPowText);

	const initResText = '  Reboot';
	const [res, updRes] = createState(false);
	const [resText, updResText] = createState(initResText);

	return (
		<menubutton>
			<label css="font-size: 22px;" xalign={0} label="" />
			<popover
				onClosed={() => {
					updPow(false);
					updPowTxt(initPowText);

					updRes(false);
					updResText(initResText);
				}}
			>
				<box spacing={4} orientation={Gtk.Orientation.VERTICAL}>
					<button
						onClicked={async () => {
							if (pow()) {
								await execAsync('poweroff');
							} else {
								updPow(true);
								updPowTxt(confText);
							}
						}}
						label={powTxt}
					/>
					<button
						onClicked={async () => {
							if (res()) {
								await execAsync('reboot');
							} else {
								updRes(true);
								updResText(confText);
							}
						}}
						label={resText}
					/>
					<button
						onClicked={async () => {
							await execAsync(`${GLib.getenv('TERMINAL') ?? 'kitty'}`);
						}}
					>
						   Launch Terminal
					</button>
				</box>
			</popover>
		</menubutton>
	);
}
