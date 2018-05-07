const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const debug = require('gulp-debug');
const util = require('gulp-util');

const {rollup} = require('rollup');
const rollupBabel = require('rollup-plugin-babel');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupJson = require('rollup-plugin-json');
const rollupReplace = require('rollup-plugin-replace');
const rollupUglify = require('rollup-plugin-uglify');

const FORMAT_ESM = 'esm';
const FORMAT_CJS = 'cjs';
const FORMAT_UMD = 'umd';

const MODULE_NAME = 'Eventbrite';

const SOURCE_ENTRY = 'src/index.ts';

const FILES_TO_BUILD = [
    // include all the JavaScript files in src/ directory
    'src/**/*.@(ts|js)',

    // but exclude the test files
    '!src/**/__tests__/**',
];

// When transpiling to ES format, we still use the `env` preset
// and we want everything transpiled EXCEPT modules
const ESM_ENV_PRESET = ['@babel/env', {modules: false}];

// When transpiling to UMD, we need the UMD transform plugin.
// Need to explicitly list the globals unfortunately
const UMD_TRANSFORM_PLUGIN = [
    '@babel/plugin-transform-modules-umd',
    {
        globals: {
            index: MODULE_NAME,
            'isomorphic-fetch': 'fetch',
        },
        exactGlobals: true,
    },
];

const _getBabelConfig = (format) => ({
    babelrc: false,

    presets: [
        format === FORMAT_ESM ? ESM_ENV_PRESET : '@babel/env',
        '@babel/typescript',
    ],
    plugins: [
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        '@babel/plugin-external-helpers',
        ...(format === FORMAT_UMD ? [UMD_TRANSFORM_PLUGIN] : []),
    ],
});

const _getBabelStream = (format) =>
    gulp
        // get a stream of the files to transpile
        .src(FILES_TO_BUILD)
        // initialize the sourcemaps (used by UMD only)
        .pipe(format === FORMAT_UMD ? sourcemaps.init() : util.noop())
        // do the appropriate babel transpile (this is a copy from package.json)
        .pipe(babel(_getBabelConfig(format)));

const _genUmd = ({minify = false} = {}) =>
    _getBabelStream(FORMAT_UMD)
        // If you're using UMD, you probably don't have `process.env.NODE_ENV` so, we'll replace it.
        // If you're using the unminified UMD, you're probably in DEV
        // If you're using the unminified UMD, you're probably in production
        .pipe(
            replace(
                'process.env.NODE_ENV',
                JSON.stringify(minify ? 'production' : 'development')
            )
        )
        // minify the files and rename to .min.js extension (when minifying)
        .pipe(minify ? uglify() : util.noop())
        .pipe(minify ? rename({extname: '.min.js'}) : util.noop())
        .pipe(sourcemaps.write('./'))
        .pipe(
            debug({
                title: minify ? 'Building + Minifying UMD:' : 'Building UMD:',
            })
        )
        .pipe(gulp.dest('lib/umd'));

const _genDist = ({minify = false} = {}) =>
    rollup({
        input: SOURCE_ENTRY,

        plugins: [
            // Need to replace `process.env.NODE_ENV` in the bundle because most likely the place where this
            // would be used doesn't support it. When minified we assume production, dev otherwise
            rollupReplace({
                'process.env.NODE_ENV': JSON.stringify(
                    minify ? 'production' : 'development'
                ),
            }),

            // convert JSON files to ES6 modules, so they can be included in Rollup bundle
            rollupJson(),

            // Locate modules using the Node resolution algorithm, for using third party modules in node_modules
            rollupNodeResolve({
                // use "module" field for ES6 module if possible
                module: true,

                // use (legacy) "jsnext:main" if possible
                jsnext: true,

                // use "main" field or index.(ts|js)
                main: true,

                // use "browser" field if possible
                browser: true,

                // include typescript files as default extensions
                extensions: ['.ts', '.js'],
            }),

            // Convert CommonJS modules to ES6 modules, so they can be included in a Rollup bundle
            rollupCommonjs({
                // Node modules are the ones we're trying to get it to understand
                include: 'node_modules/**',
            }),

            // Seamless integration between Rollup and Babel
            rollupBabel(
                Object.assign(
                    {
                        // don't worry about transpiling node_modules when bundling
                        exclude: 'node_modules/**',

                        // don't place helpers at the top of the files, but point to reference contained external helpers
                        externalHelpers: true,
                    },
                    _getBabelConfig(FORMAT_ESM)
                )
            ),

            // Minify the code if that option is specified
            // `false` will get filtered out below
            minify && rollupUglify(),
        ].filter(Boolean),
    }).then((bundle) => {
        bundle.write({
            format: FORMAT_UMD,
            file: `dist/eventbrite${minify ? '.min' : ''}.js`,

            // The window global variable name for the package
            name: MODULE_NAME,

            sourcemap: true,
        });
    });

// Used by modern dependency systems like Webpack or Rollup that can do tree-shaking
gulp.task('build:lib:esm', () =>
    _getBabelStream(FORMAT_ESM)
        .pipe(debug({title: 'Building ESM:'}))
        .pipe(gulp.dest('lib/esm'))
);

// Used primarily by Node for resolving dependencies
gulp.task('build:lib:cjs', () =>
    _getBabelStream(FORMAT_CJS)
        .pipe(debug({title: 'Building CJS'}))
        .pipe(gulp.dest('lib/cjs'))
);

// Used by legacy dependency systems like requireJS
gulp.task('build:dist', () => _genDist());
gulp.task('build:dist:min', () => _genDist({minify: true}));

// Unclear what would use this over the previous 3, but keeping for now
// May get removed in later releases
gulp.task('build:lib:umd', () => _genUmd());
gulp.task('build:lib:umd:min', () => _genUmd({minify: true}));

gulp.task('build:lib', [
    'build:lib:esm',
    'build:lib:cjs',
    'build:lib:umd',
    'build:lib:umd:min',
]);

gulp.task('build', ['build:lib', 'build:dist', 'build:dist:min']);

gulp.task('default', ['build']);
