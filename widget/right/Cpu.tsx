import GLib from 'gi://GLib?version=2.0';
import Gio from 'gi://Gio?version=2.0';
import { createState, onCleanup } from 'gnim';

export default function CPU() {
	function readCpuTimes() {
		const [, out] = Gio.File.new_for_path('/proc/stat').load_contents(null);
		const line = new TextDecoder().decode(out).split('\n')[0];
		const parts = line.trim().split(/\s+/).slice(1).map(Number);
		const idle = parts[3] + parts[4];
		const total = parts.reduce((a, b) => a + b, 0);
		return { idle, total };
	}

	const [usage, setUsage] = createState(0);
	let prev = readCpuTimes();

	const id = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 5000, () => {
		const curr = readCpuTimes();
		const idleDelta = curr.idle - prev.idle;
		const totalDelta = curr.total - prev.total;
		const pct = totalDelta > 0 ? 100 * (1 - idleDelta / totalDelta) : 0;
		setUsage(Math.round(pct));
		prev = curr;
		return GLib.SOURCE_CONTINUE;
	});

	onCleanup(() => GLib.source_remove(id));

	return (
		<box class="elem">
			<label label={usage((u) => `󰻠  ${u}%`)} />
		</box>
	);
}
