{
  description = "VimSnake";

  nixConfig = {
    sandbox = "relaxed";
  };

  inputs = {
    flake-utils.url = "github:numtide/flake-utils/main";
    nixpkgs.url = "github:nixos/nixpkgs/master";
    nixpkgs2511.url = "github:nixos/nixpkgs/release-25.11";
  };

  outputs =
    {
      flake-utils,
      nixpkgs,
      ...
    }:
    let
      systems = with flake-utils.lib.system; [
        aarch64-darwin
        x86_64-linux
      ];
    in
    flake-utils.lib.eachSystem systems (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        pkgs2511 = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs2511.github-copilot-cli
            pkgs.spec-kit
          ];
        };
      }
    );
}
