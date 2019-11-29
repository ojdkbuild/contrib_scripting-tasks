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
    "lib/common/listDirectory",
    "lib/common/Logger",
    "lib/common/signFile"
], function(module, listDirectory, Logger, signFile) {
    "use strict";
    var logger = new Logger(module.id);

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var attempts = 3;

    function walkAndSign(dirPath) {
        var list = listDirectory(String(dirPath.toAbsolutePath()));
        list.forEach(function(en) {
            var pa = Paths.get(dirPath, en);
            if (Files.isDirectory(pa)) {
                walkAndSign(pa);
            } else {
                logger.info("Signing file, path: [" + pa + "]");
                var success = false;
                var codes = [];
                for (var i = 0; i < attempts; i++) {
                    var code = signFile(String(pa.toAbsolutePath()), String(pa.getFileName()));
                    if (0 !== code) {
                        success = true;
                        break;
                    } else {
                        codes.push(code);
                    }
                }
                if (!success) {
                    throw new Error("Error signing file, codes: [" + JSON.stringify(codes) + "]");
                }
            }
        });
    }

    return function(dir) {
        logger.info("task started");

        var dirPath = Paths.get(dir);
        if (!(Files.exists(dirPath) && Files.isDirectory(dirPath))) {
            throw new Error("Invalid directory specified, path: [" + dirPath.toAbsolutePath() + "]");
        }

        walkAndSign(dirPath);

        logger.info("task success");
    };
});