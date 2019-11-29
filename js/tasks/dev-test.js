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
    "lib/common/isNil",
    "lib/common/Logger"
], function(module, isNil, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    return function(modId) {
        logger.info("task started");

        if (isNil(modId)) {
            require([
                "test/scratch",
                // common
                "test/lib/common/LoggerTest",
                "test/lib/common/appdirTest",
                "test/lib/common/includesTest",
                "test/lib/common/isArrayTest",
                "test/lib/common/isNilTest",
                "test/lib/common/isStringTest",
                "test/lib/common/listPropertiesTest",
                "test/lib/common/mapTest",
                // hash
                "test/lib/hash/digestFileTest",
                "test/lib/hash/hexBytesTest",
                "test/lib/hash/writeHashFileTest",
                // io
                "test/lib/io/copyBytesTest",
                "test/lib/io/copyCharsTest",
                "test/lib/io/deleteDirectoryTest",
                "test/lib/io/listDirectoryTest",
                "test/lib/io/readFileTest",
                "test/lib/io/writeFileTest",
                // zip
                "test/lib/zip/unzipFileTest",
                "test/lib/zip/zipDirectoryTest",
                // tasks
                "test/tasks/sha256-file_Test",
                "test/tasks/unzip-file_Test",
                "test/tasks/zip-dir_Test"
            ], function() {
               logger.info("target success");
            });
        } else {
            require([modId], function() {
               logger.info("task success");
            });
        }
    };
});
