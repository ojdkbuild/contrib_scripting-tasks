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
    "./collectDirectory"
], function(map, collectDirectory) {
    "use strict";

    return {
        dirAndCompIds: function(ibPath) {
            var rootPath = ibPath.resolve("jdk");
            var dirPath = rootPath.resolve("missioncontrol");
            var collected = collectDirectory(rootPath, dirPath);
            collected.dir.attributes.Id = "JMCDIR";
            return {
                dir: collected.dir,
                compIds: collected.compIds
            };
        },

        feature: function(compIds) {
            var refs = map(compIds, function(id) {
                return {
                    type: "element",
                    name: "ComponentRef",
                    attributes: {
                        Id: id
                    }
                };
            });
            return {
                type: "element",
                name: "Feature",
                attributes: {
                    Id: "jmc",
                    Absent: "allow",
                    AllowAdvertise: "no",
                    Description: "JDK Mission Control.",
                    Level: "2",
                    Title: "Mission Control"
                },
                elements: refs
            };
        }
    };
});
