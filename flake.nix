{
  description = "VimSnake";

  nixConfig = {
    sandbox = "relaxed";
  };

  inputs = {
    flake-utils.url = "github:numtide/flake-utils/main";
    nixpkgs.url = "github:nixos/nixpkgs/master";
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
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22
            pkgs.opencode
            pkgs.spec-kit
          ];
          shellHook = ''
            npm ci
          '';
        };
      }
    );
}
