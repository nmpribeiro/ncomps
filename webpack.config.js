"use strict";

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const exec = require('child_process').exec;

function consoleOutput(err, stdout, stderr) {
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
}

module.exports = {
    name: 'client',
    target: 'web',
    mode: 'none',
    entry: "./src/index.ts",
    output: {
        path:  path.resolve(__dirname+ '/dist'),
        filename: "ncomps.bundle.js"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts", ".html", ".scss", ".css"],
        modules: [ path.join(__dirname, 'node_modules') ]
    },
    resolveLoader: {
        modules: [ path.join(__dirname, 'node_modules') ]
    },
    optimization: {
        minimizer: [
            new MinifyPlugin()
        ]
    },
    module: {
        strictExportPresence: true,
        rules: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loaders: ['ts-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: "html-loader?exportAsEs6Default"
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)$/,
                use: 'file-loader',
            },

            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "html-loader?exportAsEs6Default" // translates CSS into CommonJS
                    },
                    //{
                    //    loader: "css-loader" // translates CSS into CommonJS
                    //},
                    {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: "html-loader?exportAsEs6Default"
            },
            
            // ** STOP ** Are you adding a new loader?
            // Remember to add the new extension(s) to the "file" loader exclusion list.
        ]
    },
    plugins: [
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new ExtractTextPlugin('[name].[contenthash].css', {
            allChunks: true
        }),
        {
            apply: (compiler) => {
                compiler.hooks.beforeCompile.tap('BeforeCompilePlugin', () => {
                    exec(
                        'echo "\n\n>> Removing dist and compiling again\n\n"',
                        consoleOutput
                    );
                    exec(
                        'cd dist && rm -rf ./*',
                        consoleOutput
                    );
                });
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
                    exec(
                        'echo "\n\n>> Now copying to integration test\n\n"', 
                        consoleOutput
                    );
                    exec('npm run copy', consoleOutput);
                });
            }
        }
    ]
};