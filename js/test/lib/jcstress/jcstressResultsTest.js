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
    "lib/jcstress/jcstressResults",
    "test/assert",
    "test/scratch"
], function(module, appdir, Logger, startsWith, readFile, writeFile, jcstressResults, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var lines = jcstressResults(appdir + "js/test/data/jcstress_results.txt");

    writeFile(scratch + "jcstressResultsTest.txt", lines.join("\n"));

    assert(lines.length > 0);
    assert.equal(lines[0], "Java Concurrency Stress Tests");
    assert.equal(lines[lines.length - 1], "Done.");

    var interesting = false;
    var failed = false;
    var error = false;
    lines.forEach(function(li) {
        if (startsWith(li, "*** INTERESTING tests")) {
            interesting = true;
        }
        if (startsWith(li, "*** FAILED tests")) {
            failed = true;
        }
        if (startsWith(li, "*** ERROR tests")) {
            error = true;
        }
    });
    assert(interesting && failed && error);

});
