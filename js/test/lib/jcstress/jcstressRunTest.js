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
    "lib/jcstress/jcstressRun",
    "test/assert",
    "test/scratch"
], function(module, Logger, jcstressRun, assert, scratch) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    logger.info("run");

    var outputFile = scratch + "jcstressRunTest.txt"
    var code = jcstressRun("", outputFile, true);
    assert.equal(code, 0);
    assert(Files.exists(Paths.get(outputFile)));

});
