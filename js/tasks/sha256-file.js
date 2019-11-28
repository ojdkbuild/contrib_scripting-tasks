/*
 * Copyright 2019, akashche at redhat.com
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
    "common/digestFile",
    "common/Logger",
    "common/writeFile"
], function(module, digestFile, Logger, writeFile) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(file) {
        logger.info("target started");

        var path = Paths.get(file);
        if (!(Files.exists(path) && Files.isRegularFile(path))) {
            throw new Error("Specified file does not exist, path: [" + path.toAbsolutePath() + "]");
        }
        logger.info("Reading file, path: [" + file + "]");

        var hash = digestFile(file, "SHA-256");
        logger.info("Hash sum computed, value: [" + hash + "]");

        var dir = path.getParent();
        var dest = Paths.get(dir, String(path.getFileName()) + ".sha256");
        writeFile(dest, hash + "  " + path.getFileName());
        logger.info("Hash sum file written, path: [" + dest + "]");

        logger.info("target success");
    };
});