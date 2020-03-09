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
    "lib/common/appdir",
    "lib/common/Logger",
    "lib/common/startsWith",
    "lib/io/readFile",
    "lib/io/writeFile",
    "lib/specjvm/specjvmResults",
    "test/assert",
    "test/scratch"
], function(module, appdir, Logger, startsWith, readFile, writeFile, specjvmResults, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var lines = specjvmResults(appdir + "js/test/data/specjvm_results.txt");

    writeFile(scratch + "specjvmResultsTest.txt", lines.join("\n"));

    assert(lines.length > 0);
    assert.equal(lines[0], "# JMH 1.17.3 (released 1178 days ago, please consider updating!)");

    var complete = false;
    var last = false;
    lines.forEach(function(li) {
        if (startsWith(li, "# Run complete. Total time: ")) {
            complete = true;
        }
        if (startsWith(li, "XmlValidation.test")) {
            last = true;
        }
    });
    assert(complete && last);

});
