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
    "lib/io/deleteDirectory",
    "lib/io/listDirectory",
    "lib/jmod/jmodBundle",
    "lib/jmod/jmodDescribe",
    "lib/jmod/jmodExtract",
    "lib/jmod/jmodList",
    "test/assert"
], function(deleteDirectory, listDirectory, jmodBundle, jmodDescribe, jmodExtract, jmodList, assert) {
    "use strict";

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    // standalone run only
    return function(jmodsDir) {
        var mods = listDirectory(jmodsDir);
        mods.forEach(function(md) {
            print(md);
            var jmod = jmodsDir + "/" + md;
            var jmodPath = Paths.get(jmod);
            var descOrig = jmodDescribe(jmod);
            var contentsOrig = jmodList(jmod);
            var sizeOrig = Files.size(jmodPath);
            var dir = jmodExtract(String(jmodPath));
            Files.delete(jmodPath);
            jmodBundle(dir);
            deleteDirectory(dir);
            assert.equal(jmodDescribe(jmod), descOrig);
            assert.equal(jmodList(jmod), contentsOrig);
            var sizeDiff = Files.size(jmodPath) - sizeOrig;
            assert(sizeDiff >= -8 && sizeDiff <= 8);
        });
    };

});
