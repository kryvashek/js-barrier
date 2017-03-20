module.exports = {
    barrier: barrier
};

/**
 * @description Invokes several routines and calls specified callback after finishing every of them.
 * @requires Requires callback specified as an argument for every asynchronous routine.
 * @param routines Array of the routines to synchronize, every item should have next fields:
 *     func (function itself),
 *     [ args ] (array of the arguments including the callback; may be empty or even undefined),
 *     [ cbkey ] (key of the callback function in the args; if not specified, the last function in the args assumed to be the callback).
 * @param callback Description of the function to invoke after finishing of the every called routine, should contain fields:
 *     func (function itself),
 *     [ args ] (array of the arguments for the callback; may be empty or even undefined).
 * @returns Returns nothing.
 **/
function barrier(routines, callback) {
    var callbacksCount = 0,
        doRoutine = routine => {
            if (!routine || !routine.func)
                return;

            if (routine.args)
                routine.func(...routine.args);
            else
                routine.func();
        };

    routines.forEach(item => {
        if (!(item && item.func && item.args))
            return;

        if (!item.cbkey)
            Object.keys(item.args).reverse().some(key => ('function' === typeof item.args[item.cbkey = key]));

        if ('function' === typeof item.args[item.cbkey]) {
            var localCallback = item.args[item.cbkey];

            callbacksCount++;
            item.args[item.cbkey] = (...funcArgs) => {
                localCallback(...funcArgs);
                callbacksCount--;

                if (0 >= callbacksCount)
                    doRoutine(callback);
            };
        }
    });

    var invokeCallback = (0 === callbacksCount);

    routines.forEach(doRoutine);

    if (invokeCallback)
        doRoutine(callback);
}