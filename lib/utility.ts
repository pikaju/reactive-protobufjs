export class CancellationToken {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.resolve = () => {};
    this.promise = new Promise((resolve) => this.resolve = () => resolve());
  }

  #isCanceled = false;
  public get isCanceled(): boolean { return this.#isCanceled; }

  private resolve: () => void;
  public readonly promise: Promise<void>; 

  cancel(): void {
    if (this.isCanceled) return;
    this.#isCanceled = true;
    this.resolve();
  }
}
