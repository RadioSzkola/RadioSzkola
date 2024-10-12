{
  description = "radio-szkola-flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    "nodejs-v20.17.0-nixpkgs".url =
      "github:nixos/nixpkgs/5ed627539ac84809c78b2dd6d26a5cebeb5ae269";
    "pnpm-v9.10.0-nixpkgs".url =
      "github:nixos/nixpkgs/673d99f1406cb09b8eb6feab4743ebdf70046557";
  };

  outputs = { self, nixpkgs, ... }@inputs:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.${system}.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          inputs."nodejs-v20.17.0-nixpkgs".legacyPackages.${system}.nodejs_20
          inputs."pnpm-v9.10.0-nixpkgs".legacyPackages.${system}.pnpm
          pkgs.typescript-language-server
          #nodejs
          #pnpm
        ];
      };
    };
}
