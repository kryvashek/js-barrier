# silly-barrier #
JS module presenting routine to synchronize several asynchronous functions that invoke callbacks.

## Version ##
Current module version is 0.4.0.

## License ##
**silly-barrier** is licensed under BSD 3-clause "Revised" License. See [license](./LICENSE) for details.

## Usage ##
### Install ###
Just run command `npm install silly-barrier` to have this module installed for your project. See usage of **npm** tool for details.

### Test ###
To test module just run command `nodejs ./test.js` from the console in the folder where module is placed. You should see the output like that:

	Routine #0 output
	Callback #0 output
	...
	Routine #4 output
	Callback #4 output
	Invoking final callback...
	Final callback invoked, output has 12 lines
	1) Routine #0 output
	2) Callback #0 output
	...
	9) Routine #4 output
	10) Callback #4 output
	11) Invoking final callback...
	12) Final callback invoked, output has 12 lines

### Run ###
For using **silly-barrier** in a code one need to form an array of so-called routines. Each routine should contain at least field **func** which value should be a function that will be invoked as some asynchronous routine. 

Routine can also contain optional field **args** - array of arguments to pass to the function while invoking including callback for that routine. If no arguments are specified, no callback can be called therefore.

There is also yet another optinal field **cbkey** which can specify index of a callback function in the arguments array. If no field **cbkey** is cpecified for current routine, the last function in the arguments array will be assumed as callback (even if it is not the last argument of the entire array).

Example of routines array:

    var routines = [
		{ 
			func: ( arg1, arg2, callbackfn ) => { 
				var temp = arg1 + arg2;
				callbackfn( temp );
			},
			args: [ 1, 2, alert ]
		},
		{ 
			func: ( arg1, callbackfn, somefunc ) => {
				var temp = somefunc( arg1 );
				callbackfn( temp );
			},
			args: [ 0.5, console.log, Math.sin ],
			cbkey: 1 
		},
		{
			func: () => { console.log( 'Routine without arguments and callback.' ) }
		}
	];

After creating of described array, one should call imported **barier** function with next parameters:

* **routines** - array described above,
* **callback** - description of the routine to be invoked in the very final, after completing of every routine from the first parameter array.

**callback** should contain field **func** specifying the function to call at the very end of all work. It also may contain an optional array **args** of arguments to pass to the function while invoking.

Example of function **barrier** calling:

    require('silly-barrier').barrier( routines, { func: alert, args: [ 'Finished!' ] } );

The full working example of module usage one can find in [test.js](./test.js).