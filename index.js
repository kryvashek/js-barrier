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
        doRoutine = routine => { // routine invoker
            if (!routine || !routine.func) // if routine is unspecified - skip it
                return;

            if (routine.args) // if parameters are specified - pass them to the routine while invoking
                routine.func(...routine.args);
            else // otherwise invoke routine without any parameters
                routine.func();
        };

    routines.forEach(item => {
        if (!(item && item.func && item.args)) // if routine or parameters are unspecified - skip it
            return;

        if (!item.cbkey) // if local callback key is unspecified - find it out
            Object.keys(item.args).reverse().some(key => ('function' === typeof item.args[item.cbkey = key]));

        if ('function' === typeof item.args[item.cbkey]) { // if local callback was found among the routine parameters
            var localCallback = item.args[item.cbkey];

            callbacksCount++; // count up callable routines with specified local callbacks
            item.args[item.cbkey] = (...funcArgs) => { // form new callback instead of old, with coutning down
                localCallback(...funcArgs); // invoke old callback with given parameters
                callbacksCount--; // count down finished local callbacks

                if (0 >= callbacksCount) // invoke global callback if count down is finished
                    doRoutine(callback);
            };
        }
    });

    var invokeCallback = (0 === callbacksCount); // check whether there were any callable routines with specified local callbacks among the arguments

    routines.forEach(doRoutine); // invoke all available callable routines from the arguments

    if (invokeCallback) // if there were no callable routines with specified local callbacks among the arguments - invoke global callback from here
        doRoutine(callback);
}