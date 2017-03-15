function test() {
    var output = [],
        print = message => {
            if ('string' !== typeof message)
                message = JSON.stringify(message);

            console.log(message);
            output.push(`${1 + output.length}) ` + message);
        },
        routine = (index, callbackfn) => {
            print(`Routine #${index} output`);
            callbackfn(index);
        },
        callback = index => {
            print(`Callback #${index} output`);
        },
        final = message => {
            print(message);
            print(`Final callback invoked, output has ${1 + output.length} lines`);
            console.log(output.join('\n'));
        },
        routines = [];

    for (var i = 0; i < 5; i++)
        routines.push({ func: routine, args: [i, callback] });

    require('./index').barrier(routines, { func: final, args: ['Invoking final callback...'] });
}

test();