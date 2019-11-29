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
    "../io/writeFile"
], function(writeFile) {
    "use strict";

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(origFile, hash, extension) {
        var path = Paths.get(origFile);
        if (!(Files.exists(path) && Files.isRegularFile(path))) {
            throw new Error("Invalid original file, path: [" + path.toAbsolutePath() + "]");
        }

        var dir = path.getParent();
        var dest = Paths.get(dir, String(path.getFileName()) + extension);
        if (Files.exists(dest)) {
            throw new Error("Hash file already exist, path: [" + path.toAbsolutePath() + "]");
        }
 
        writeFile(dest.toAbsolutePath(), hash + "  " + path.getFileName());
        return String(dest.toAbsolutePath());
    };

});
