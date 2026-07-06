import app from 'ags/gtk4/app';
import { Astal, Gdk } from 'ags/gtk4';
import Clock from './right/Clock';
import Mpris from './left/Mpris';
import Tray from './right/Tray';
import Menu from './left/Menu';
import Workspaces from './left/Workspaces';
import ActiveWindow from './middle/ActiveWindow';
import Audio from './right/Audio';
import Bluetooth from './right/Bluetooth';
import CPU from './right/Cpu';

export default function Bar(gdkmonitor: Gdk.Monitor) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
	const globalSpacing = 4;

	return (
		<window
			visible
			name="bar"
			class="Bar"
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
		>
			<centerbox cssName="centerbox">
				<box spacing={globalSpacing} $type="start">
					<Menu />
					<Workspaces />
					<Mpris />
				</box>

				<box $type="center">
					<ActiveWindow />
				</box>

				<box spacing={globalSpacing} $type="end">
					<Tray />
					<Bluetooth />
					<CPU />
					<Audio />
					<Clock />
				</box>
			</centerbox>
		</window>
	);
}
