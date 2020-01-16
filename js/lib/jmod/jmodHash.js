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
    "../common/isArray",
    "../common/Logger",
    "../common/startsWith",
    "../io/deleteDirectory",
    "./jmodBundle",
    "./jmodDescribe",
    "./jmodExtract",
    "./jmodList",
    "test/assert"
], function(module, isArray, Logger, startsWith, deleteDirectory, jmodBundle, jmodDescribe, jmodExtract, jmodList, assert) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(file, excludes) {
        var path = Paths.get(file);
        if (!(Files.exists(path) && Files.isRegularFile(path)) &&
                endsWith(file, ".jmod")) {
            throw new Error("Invalid JMOD file specified: [" + path.toAbsolutePath() + "]");
        }

        // '^(?!java.compiler$|jdk.aot$|jdk.internal.vm.compiler$|jdk.internal.vm.compiler.management$)'
        var excludeRegex = "'.*'";
        if (isArray(excludes)) {
            excludeRegex = "'^(?!" + excludes.join("|") + ")$'";
        }
        var args = [
            "--module-path",
            String(path.getParent()),
            "--hash-modules",
            excludeRegex
            ];

        logger.info("Extracting JMOD for hashing, path: [" + path + "]");
        var dir = jmodExtract(file);
        var descOrig = jmodDescribe(file);
        var listOrig = jmodList(file);
        Files.delete(path);

        logger.info("Hashing JMOD, path: [" + dir + "], excludes: [" + excludeRegex + "] ...");
        jmodBundle(dir, args);
        deleteDirectory(dir);

        // check correctness

        var list = jmodList(file);
        assert.equal(list, listOrig, "list");

        var desc = jmodDescribe(file);
        assert(desc.length >= descOrig.length);
        for (var i = 0; i < desc.length && i < descOrig.length; i++) {
            if (startsWith(desc[i], "hash")) {
                assert(desc[i] != descOrig[i]);
            } else {
                assert.equal(desc[i], descOrig[i], "non-hash");
            }
        }

        logger.info("JMOD hashed successfully");
    };

});
