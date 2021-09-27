/*
 * Copyright 2021, akashche at redhat.com
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
    "lib/common/map",
    "lib/io/listDirectory",
    "./cleanupId"
], function(map, listDirectory, cleanupId) {
    "use strict";

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    function stringifyPath(path) {
        return String(path).replace(/\\/g, "/");
    }

    function processDirRecursive(compIds, rootPath, dirPath) {
        var children = listDirectory(stringifyPath(dirPath));
        var elems = map(children, function(ch) {
            var chPath = dirPath.resolve(ch);
            if (Files.isDirectory(chPath)) {
                return processDirRecursive(compIds, rootPath, chPath);
            } else {
                var chRel = stringifyPath(rootPath.relativize(chPath));
                var id = cleanupId(chRel);
                compIds.push("comp_" + id);
                return {
                    type: "element",
                    name: "Component",
                    attributes: {
                        Id: "comp_" + id,
                        Guid: "*"
                    },
                    elements: [
                        {
                            type: "element",
                            name: "File",
                            attributes: {
                                Id: "file_" + id,
                                Source: "../" + stringifyPath(rootPath.getFileName()) + "/" + chRel
                            }
                        }
                    ]
                };
            }
        });
        var dirRel = stringifyPath(rootPath.getFileName()) + "/" + stringifyPath(rootPath.relativize(dirPath));
        var id = "dir_" + cleanupId(dirRel);
        return {
            type: "element",
            name: "Directory",
            attributes: {
                Id: id,
                Name: stringifyPath(dirPath.getFileName())
            },
            elements: elems
        };
    }

    return function(rootPath, dirPath) {
        var compIds = [];
        var dir = processDirRecursive(compIds, rootPath, dirPath);
        return {
            dir: dir,
            compIds: compIds
        };
    }
});
