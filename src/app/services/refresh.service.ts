import { Injectable } from '@angular/core';

@Injectable()
export class RefreshService {
  public static isPWA = window.matchMedia('(display-mode: standalone)').matches;
  public static swipeStartY: number = 0;
  private static callbackMap = new Map<any, (() => void)[]>();

  static onRefresh() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log('target', target)
      const originalMethod = descriptor.value;
      const originalNgOnInit = target.ngOnInit;
      target.ngOnInit = function (...args: any[]) {
        if (originalNgOnInit) {
          originalNgOnInit.apply(this, args);
        }
        let callbacks = [() => {
          setTimeout(() => {
            originalMethod.apply(this, args);
          });
        }]
        const index = this;
        if (RefreshService.callbackMap.has(index)) {
          callbacks = [...callbacks, ...RefreshService.callbackMap.get(index)!];
        }
        RefreshService.callbackMap.set(index, callbacks);
      };
      const originalNgOnDestroy = target.ngOnDestroy;
      target.ngOnDestroy = function (...args: any[]) {
        if (originalNgOnDestroy) {
          originalNgOnDestroy.apply(this, args);
        }
        console.log('calling target onDestroy', target)
        RefreshService.clearCallbacks(this);
      };
    };
  }

  static triggerRefresh() {
    console.log(RefreshService.callbackMap)
    for (let key of RefreshService.callbackMap.keys()) {
      const callbacks = this.callbackMap.get(key);
      callbacks && callbacks.forEach((callback) => callback());
    }
  }

  static clearCallbacks(key: any) {
    if (RefreshService.callbackMap.has(key))
      RefreshService.callbackMap.delete(key);
  }
}
