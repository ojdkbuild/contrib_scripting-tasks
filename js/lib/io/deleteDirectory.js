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
], function() {
    "use strict";

    var Files = Packages.java.nio.file.Files;
    var FileVisitResult = Packages.java.nio.file.FileVisitResult;
    var Paths = Packages.java.nio.file.Paths;
    var SimpleFileVisitor = Packages.java.nio.file.SimpleFileVisitor;

    return function(dirPath) {
        var dir = Paths.get(dirPath);

        if (!Files.exists(dir)) {
            return;
        }

        if (!Files.isDirectory(dir)) {
            throw new Error("Invalid directory specified, path: [" + dir.toAbsolutePath().toString() + "]");
        }

        Files.walkFileTree(dir, new JavaAdapter(SimpleFileVisitor, {
            visitFile: function(file, attrs) {
                Files.delete(file);
                return FileVisitResult.CONTINUE;
            },
            postVisitDirectory: function(dir, exc) {
                Files.delete(dir);
                return FileVisitResult.CONTINUE;
            }
        }));
    };

});
