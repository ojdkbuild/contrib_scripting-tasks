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
    "common/Logger"
], function(module, Logger) {
    "use strict";
    var logger = new Logger(module.id);

    return function() {
       logger.info("target started");

        require([
            // common
            "test/common/LoggerTest",
            "test/common/appdirTest",
            "test/common/copyBytesTest",
            "test/common/includesTest",
            "test/common/isArrayTest",
            "test/common/isNilTest",
            "test/common/isStringTest",
            "test/common/listDirectoryTest",
            "test/common/listPropertiesTest",
            "test/common/mapTest"
        ], function() {
           logger.info("target success");
        });
    };
});
