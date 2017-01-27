import { MediaService, ObservableMediaService } from '../observable-media-service';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
import { MatchMedia } from '../match-media';
/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export var ObservableMediaServiceProvider = {
    provide: ObservableMediaService,
    useClass: MediaService,
    deps: [MatchMedia, BreakPointRegistry]
};
//# sourceMappingURL=/usr/local/google/home/andrewjs/Desktop/caretaker/flex-layout/src/lib/media-query/providers/observable-media-service-provider.js.map