{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
	buildInputs = [
		pkgs.nodejs
		pkgs.nodePackages.create-react-app
	];
}
