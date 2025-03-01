export class MobileDrawerObserver {
  private static _instance: MobileDrawerObserver | undefined;
  private _drawerState: boolean;
  private _listener: VoidFunction | undefined;

  private constructor() {
    this._drawerState = false;
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new MobileDrawerObserver();
      return this._instance;
    }

    return this._instance;
  }

  toggle() {
    this._drawerState = !this._drawerState;
    this._listener?.();
  }

  setListener(listener: VoidFunction) {
    this._listener = listener;
  }
}
