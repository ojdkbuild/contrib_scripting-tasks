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
    "common/Logger",
    "common/zipDirectory"
], function(module, Logger, zipDirectory) {
    "use strict";
    var logger = new Logger(module.id);

    return function(dir) {
        logger.info("target started");
        logger.info("Zipping directory, path: [" + dir + "]");

        zipDirectory(dir);

        logger.info("target success");
    };
});