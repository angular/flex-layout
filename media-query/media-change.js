/**
 * Class instances emitted [to observers] for each mql notification
 */
export var MediaChange = (function () {
    function MediaChange(matches, // Is the mq currently activated
        mediaQuery, // e.g.   (min-width: 600px) and (max-width: 959px)
        mqAlias, // e.g.   gt-sm, md, gt-lg
        suffix // e.g.   GtSM, Md, GtLg
        ) {
        if (matches === void 0) { matches = false; }
        if (mediaQuery === void 0) { mediaQuery = 'all'; }
        if (mqAlias === void 0) { mqAlias = ''; }
        if (suffix === void 0) { suffix = ''; }
        this.matches = matches;
        this.mediaQuery = mediaQuery;
        this.mqAlias = mqAlias;
        this.suffix = suffix;
    }
    return MediaChange;
}());
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/media-query/media-change.js.map