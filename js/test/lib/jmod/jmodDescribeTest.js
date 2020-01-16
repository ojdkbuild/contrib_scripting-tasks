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
    "lib/common/appdir",
    "lib/common/Logger",
    "lib/common/startsWith",
    "lib/jmod/jmodDescribe",
    "test/assert"
], function(module, appdir, Logger, startsWith, jmodDescribe, assert) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var desc = jmodDescribe(appdir + "js/test/data/jdk.net.jmod");

    assert(startsWith(desc[0], "jdk.net"));
    assert(startsWith(desc[desc.length - 1], "platform "));
});
