import { Injectable } from '@angular/core';

@Injectable()
export class RefreshService {
  public static isPWA = window.matchMedia('(display-mode: standalone)').matches;
  public static swipeStartY: number = 0;
  private static callbackMap = new Map<any, (() => Promise<void>)[]>();

  /**
   * Decorator for functions that will be called whenever a user swipes down at the top of the page to refresh.
   * Only works when being used as a Progressive Web App (PWA).
   * Methods decorated with `@RefreshService.onRefresh()` will be run once at the end of the component's `OnInit` lifecycle.
   * The methods will no longer be called on refresh at the end of the component's `OnDestroy` lifecycle.
   * 
   * All methods of currently instantiated components decorated with `@RefreshService.onRefresh()` can be called manually by `@RefreshService.triggerRefresh()`.
   */
  public static onRefresh() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      const originalNgOnInit = target.ngOnInit;
      target.ngOnInit = function (...args: any[]) {
        if (originalNgOnInit) {
          originalNgOnInit.apply(this, args);
        }
        let callbacks = [() => {
          return Promise.resolve(originalMethod.apply(this, args));
        }]
        const index = this;
        if (RefreshService.callbackMap.has(index)) {
          callbacks = [...callbacks, ...RefreshService.callbackMap.get(index)!];
        }
        RefreshService.callbackMap.set(index, callbacks);
        originalMethod.apply(this, args);
      };
      const originalNgOnDestroy = target.ngOnDestroy;
      target.ngOnDestroy = function (...args: any[]) {
        if (originalNgOnDestroy) {
          originalNgOnDestroy.apply(this, args);
        }
        RefreshService.clearCallbacks(this);
      };
    };
  }

  /**
   * Calls all methods of currently instantiated components decorated with the `@RefreshService.onRefresh()` decorator.
   */
  public static async triggerRefresh() {
    console.log('trigger refresh', RefreshService.callbackMap);
    const promises: Promise<void>[] = [];
    for (let key of RefreshService.callbackMap.keys()) {
      const callbacks = this.callbackMap.get(key);
      callbacks && callbacks.forEach((callback) => {
        const result = callback();
        console.log('is promise', result instanceof Promise)
        promises.push(result instanceof Promise ? result : Promise.resolve())
      });
    }
    await Promise.all(promises);
  }

  public static clearCallbacks(key: any) {
    if (RefreshService.callbackMap.has(key))
      RefreshService.callbackMap.delete(key);
  }
}
