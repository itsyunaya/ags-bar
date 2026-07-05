import AstalMpris from "gi://AstalMpris"
import {createBinding, createComputed, For, With} from "gnim";
import {Gtk} from "ags/gtk4";

export default function Mpris() {
	const mpris = AstalMpris.get_default()

	const players = createComputed(() => {
		const seen = new Set<string>()
		const result: AstalMpris.Player[] = []
		for (const player of createBinding(mpris, "players")()) {
			const key = player.identity ?? player.busName
			if (!seen.has(key)) {
				seen.add(key)
				result.push(player)
			}
		}
		return result
	})

	return (
		<menubutton>
			<box>
				<With value={players}>
					{(ps) => {
						const player = ps[0]
						if (!player) return null
						return (
							<box spacing={5}>
								<label xalign={0} label={createBinding(player, "playbackStatus")() == 0 ? " " : " "}/>
								<label
									xalign={0}
									label={createComputed(() => {
										const artist = createBinding(player, "artist")()
										const title = createBinding(player, "title")()
										return `${artist} – ${title}`
									})}
								/>
							</box>
						)
					}}
				</With>
			</box>
			<popover>
				<box spacing={4} orientation={Gtk.Orientation.VERTICAL}>
					<For each={players}>
						{(player) => (
							<box spacing={4} widthRequest={200}>
								<box overflow={Gtk.Overflow.HIDDEN} css="border-radius: 8px;">
									<image
										pixelSize={44}
										file={createBinding(player, "coverArt")}
									/>
								</box>
								<box
									valign={Gtk.Align.CENTER}
									orientation={Gtk.Orientation.VERTICAL}
								>
									<label xalign={0} label={createBinding(player, "artist")}/>
									<label xalign={0} label={createBinding(player, "title")}/>
								</box>
								<box hexpand halign={Gtk.Align.END}>
									<button
										onClicked={() => player.previous()}
										visible={createBinding(player, "canGoPrevious")}
									>
										<image iconName="media-seek-backward-symbolic"/>
									</button>
									<button
										onClicked={() => player.play_pause()}
										visible={createBinding(player, "canControl")}
									>
										<box>
											<image
												iconName="media-playback-start-symbolic"
												visible={createBinding(
													player,
													"playbackStatus",
												)((s) => s === AstalMpris.PlaybackStatus.PLAYING)}
											/>
											<image
												iconName="media-playback-pause-symbolic"
												visible={createBinding(
													player,
													"playbackStatus",
												)((s) => s !== AstalMpris.PlaybackStatus.PLAYING)}
											/>
										</box>
									</button>
									<button
										onClicked={() => player.next()}
										visible={createBinding(player, "canGoNext")}
									>
										<image iconName="media-seek-forward-symbolic"/>
									</button>
								</box>
							</box>
						)}
					</For>
				</box>
			</popover>
		</menubutton>
	)
}
