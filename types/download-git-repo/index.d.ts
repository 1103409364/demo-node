declare module "download-git-repo" {
  export default function download(
    repo: string,
    dest: string,
    opts: any,
    fn: Function
  ): void;
}
