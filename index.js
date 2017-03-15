module.exports = {
    barrier: barrier
};

/**
 * @description Invokes several routines and calls specified callback after finishing every of them.
 * @requires Every called routine should call its own callback - there is no way to synchronize them without that feature.
 * @param routines Array of the routines to synchronize, every item should have next fields:
 *     - func (function itself),
 *     - args (array of the arguments including the callback),
 *     - [ cbkey ] (optional; key of the callback function in the args; if not specified, the last function in the args assumed to be the callback).
 * @param callback Description of the function to invoke after finishing of the every called routine, should contain fields:
 *     - func (function itself),
 *     - args (array of the arguments for the callback).
 * @returns Returns nothing.
 **/
function barrier(routines, callback) {
    var callbacksCount = 0;

    routines.forEach(item => {
        if (!item.cbkey)
            item.cbkey = Object.keys(item.args).reduce((prev, curr) => ('function' === typeof item.args[curr] ? curr : prev));

        if ('function' === typeof item.args[item.cbkey]) {
            var localCallback = item.args[item.cbkey];

            callbacksCount++;
            item.args[item.cbkey] = (...funcArgs) => {
                localCallback(...funcArgs);
                callbacksCount--;

                if (0 >= callbacksCount)
                    callback.func(...callback.args);
            };
        }
    });

    var invokeCallback = (0 === callbacksCount);

    routines.forEach(item => item.func(...item.args));

    if (invokeCallback)
        callback.func(...callback.args);
}