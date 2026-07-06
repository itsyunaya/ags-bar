{
	description = "ags :>";

	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

		ags = {
			url = "github:aylur/ags";
			inputs.nixpkgs.follows = "nixpkgs";
		};
	};

	outputs = { self, nixpkgs, ags }: let
		system = "x86_64-linux";
		pkgs = nixpkgs.legacyPackages.${system};
		pname = "ags-bar";
		entry = "app.ts";

		# when adding a new lib and regenning typedecs you **need** to specify
		# the current dir else ags will put them somewhere in .config
		# do `ags types -d . -u` from the proj root
		astalPackages = builtins.attrValues {
			inherit
				(ags.packages.${system})
				astal4
				bluetooth
				hyprland
				mpris
				tray
				wireplumber
				;
		};

		extraPackages =
			astalPackages
			++ [
				pkgs.libadwaita
				pkgs.libsoup_3
			];
	in {
		packages.${system} = {
			default = pkgs.stdenv.mkDerivation {
				name = pname;
				src = ./.;

				nativeBuildInputs = with pkgs; [
					wrapGAppsHook3
					gobject-introspection
					ags.packages.${system}.default
				];

				buildInputs = extraPackages ++ [ pkgs.gjs ];

				installPhase = ''
					runHook preInstall

					mkdir -p $out/bin
					mkdir -p $out/share
					cp -r * $out/share
					ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

					runHook postInstall
				'';
			};
		};

		devShells.${system} = {
			default = pkgs.mkShell {
				buildInputs = [
					(ags.packages.${system}.default.override {
							inherit extraPackages;
						})
				];
			};
		};
	};
}
