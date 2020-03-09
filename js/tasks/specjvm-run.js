/*
 * Copyright 2020, akashche at redhat.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define([
    "module",
    "lib/common/Logger",
    "lib/io/writeFile",
    "lib/specjvm/specjvmResults",
    "lib/specjvm/specjvmRun"
], function(module, Logger, writeFile, specjvmResults, specjvmRun) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(javaHome, specjvmJar, resultsFile, mock) {
        logger.info("task started");

        var outFile = resultsFile + "_out.txt";
        var code = specjvmRun(javaHome, specjvmJar, outFile, mock);
        if (0 !== code) {
            throw new Error("specjvm run failure, code: [" + code + "]");
        }
        logger.info("specjvm run finished, processing results ...");

        var lines = specjvmResults(outFile);
        Files.delete(Paths.get(outFile));
        writeFile(resultsFile, lines.join("\n"));
        logger.info("specjvm results written, path: [" + resultsFile + "]");

        logger.info("task success");
    };
});
